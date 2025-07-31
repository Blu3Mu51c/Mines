// DOM elements
const gridElement = document.querySelector('.grid');
const flagsLeftElement = document.querySelector('#flagLeft');
const flagTextElement = document.querySelector('.flagText');
const selectTheme = document.getElementById('theme');
const saveTheme = localStorage.getItem('selectedTheme');
const timer = document.querySelector('.timer');
const userGrid = document.getElementById('userGrid');
const userMine = document.getElementById('userMine');
const setGridButton = document.getElementById('btn');
const explodeSound = new Audio('./assets/Explode.mp3');
const loseSound = new Audio('./assets/Lose.mp3');
const winSound = new Audio('./assets/Win.mp3');
const tileSound = new Audio('./assets/Tile.mp3');
const flagSound = new Audio('./assets/Flag.mp3');


// Tile status constants
const tileStatus = {
  hidden: 'hidden',
  mine: 'mine',
  number: 'number',
  marked: 'marked',
};


// Variables
let gridSize;
let numberOfMines;
let timeTick = 0;
let timerInterval;


// Set grid size and number of mines
// Defaults to 12x12 grid with 10 mines to avoid invalid values or constraints
function setGrid() {
  gridValue = Math.floor(parseInt(userGrid.value));
  mineValue = Math.floor(parseInt(userMine.value));

  gridSize = gridValue;
  numberOfMines = mineValue;
  maxMines = gridValue * gridValue;
  console.log(maxMines);

  if (!gridValue || !mineValue) {
    gridSize = 12;
    numberOfMines = 10;
  } else if (mineValue >= maxMines) {
    gridSize = 12;
    numberOfMines = 10;
  }

  userGrid.value = "";
  userMine.value = "";
}

setGridButton.addEventListener('click', setGrid());

// Reload the page
function reloadPage() {
  location.reload();
}


// Create the grid with tiles and place mines randomly
function createGrid(gridSize, numberOfMines) {
  const grid = [];
  const minePositions = getMinePositions(gridSize, numberOfMines);

  for (let rows = 0; rows < gridSize; rows++) {
    const row = [];
    for (let cols = 0; cols < gridSize; cols++) {
      const individualTile = document.createElement('div');
      individualTile.dataset.status = tileStatus.hidden;

      const tiles = {
        individualTile,
        cols,
        rows,
        mine: minePositions.some(mineMatch.bind(null, { rows, cols })),

        // Getter and setter to access the tile's current status easily
        get status() {
          return individualTile.dataset.status;
        },
        set status(value) {
          individualTile.dataset.status = value;
        }
      };

      row.push(tiles);
    }
    grid.push(row);
  }
  return grid;
}


// Generate unique random mine positions
function getMinePositions(gridSize, numberOfMines) {
  const locations = []; // Array to store mine coordinates (row, col)

  while (locations.length < numberOfMines) {
    const location = { // Random coordinates for a mine
      rows: random(gridSize),
      cols: random(gridSize)
    };

    // Only add location if it's not already taken
    if (!locations.some(mineMatch.bind(null, location))) {
      locations.push(location);
    }
  }
  return locations;
}

// Utility function to generate random integer in [0, size)
function random(size) {
  return Math.floor(Math.random() * size);
}

// Utility function to check if two tile coordinates match
function mineMatch(x, y) {
  return x.rows === y.rows && x.cols === y.cols;
}


// Flagging and flag count functions

// Toggle flag on a tile if it's hidden or marked
function flagged(tiles) {
  if (tiles.status !== tileStatus.hidden && tiles.status !== tileStatus.marked) {
    return;
  }
  if (tiles.status === tileStatus.marked) {
    tiles.status = tileStatus.hidden;
    tiles.individualTile.textContent = '';
  } else {
    flagSound.playbackRate = 2;
    flagSound.play();
    tiles.status = tileStatus.marked;
    tiles.individualTile.textContent = '🚩';
  }
}

// Update the displayed count of flags remaining
function flagCount() {
  const flaggedTiles = grid.reduce((count, row) => {
    return count + row.filter(tiles => tiles.status === tileStatus.marked).length;
  }, 0);
  flagsLeftElement.textContent = numberOfMines - flaggedTiles;
}


// Reveal tile and recursively reveal neighbors if no adjacent mines
function reveal(grid, tiles) {
  if (tiles.status !== tileStatus.hidden) {
    return;
  }

  if (tiles.mine) {
    tiles.status = tileStatus.mine;
    tiles.individualTile.textContent = '💣';
    return;
  }

  tiles.status = tileStatus.number;
  tileSound.playbackRate = 1.5;
  tileSound.play();

  const surrounding = surroundingTiles(grid, tiles);
  const mines = surrounding.filter(t => t.mine);

  // Recursively reveal surrounding tiles if no adjacent mines
  if (mines.length === 0) {
    surrounding.forEach(reveal.bind(null, grid));
  } else {
    tiles.individualTile.textContent = mines.length;
  }
}

// Get all adjacent tiles around a given tile
function surroundingTiles(grid, { rows, cols }) {
  const surrounding = [];
  for (let rowsOffset = -1; rowsOffset <= 1; rowsOffset++) {
    for (let colsOffset = -1; colsOffset <= 1; colsOffset++) {
      const tiles = grid[rows + rowsOffset]?.[cols + colsOffset];
      if (tiles) surrounding.push(tiles);
    }
  }
  return surrounding;
}


// Win and lose condition checks
function checkWin(grid) {
  return grid.every(row => {
    return row.every(tiles => {
      return (
        tiles.status === tileStatus.number ||
        (tiles.mine && (tiles.status === tileStatus.hidden || tiles.status === tileStatus.marked))
      );
    });
  });
}

function checkLose(grid) {
  return grid.some(row => {
    return row.some(tiles => {
      return tiles.status === tileStatus.mine;
    });
  });
}


// Handle game end status: win or lose
function gameStatus() {
  const win = checkWin(grid);
  const lose = checkLose(grid);

  if (win || lose) {
    startTimer();
    stopTimer();
    gridElement.addEventListener('click', stopProp, { capture: true });
    gridElement.addEventListener('contextmenu', stopProp, { capture: true });
  }

  if (win) {
    winSound.play();
    flagTextElement.textContent = `You Win`;
    timer.textContent = `You won in ${timeTick}s`;
  }

  if (lose) {
    explodeSound.play();
    loseSound.play();
    flagTextElement.textContent = 'Boom, You lose';
    timeTick = 0;

    grid.forEach(row => {
      row.forEach(tiles => {
        if (tiles.status === tileStatus.marked) flagged(tiles);
        if (tiles.mine) reveal(grid, tiles);
      });
    });
  }
}

// Utility function to prevent any further clicks after game ends
function stopProp(e) {
  e.stopImmediatePropagation();
}


// Rendering the grid on the page and adding event listeners
const grid = createGrid(gridSize, numberOfMines);

grid.forEach(row => {
  row.forEach(tiles => {
    gridElement.append(tiles.individualTile);

    tiles.individualTile.addEventListener('click', () => {
      reveal(grid, tiles);
      gameStatus();
      startTimer();
    });

    tiles.individualTile.addEventListener('contextmenu', e => {
      e.preventDefault();
      flagged(tiles);
      flagCount();
    });
  });
});

gridElement.style.setProperty('--gs', gridSize);
flagsLeftElement.textContent = numberOfMines;
console.log(grid);


// Theme handling
if (saveTheme) {
  selectTheme.value = saveTheme;  // Set saved theme on load
  document.body.setAttribute('data-theme', saveTheme);
} else {
  // Set theme to current selection if none saved
  document.body.setAttribute('data-theme', selectTheme.value);
}

selectTheme.addEventListener('click', e => {
  const selectedTheme = e.target.value; // Update theme based on user selection
  document.body.setAttribute('data-theme', selectedTheme);
  localStorage.setItem('selectedTheme', selectedTheme); // Save selection to local storage
});


// Timer functions
function startTimer() {
  if (timerInterval) return; // Prevent multiple timers from starting

  timerInterval = setInterval(() => {
    timeTick++;
    timer.textContent = `${String(timeTick).padStart(3, '0')}`; // Format time as 000
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval); // Stop the timer
}
