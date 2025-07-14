const gridElement = document.querySelector('.grid');

const flagsLeftElement = document.querySelector('#flagLeft');
const flagTextElement = document.querySelector('.flagText');

const selectTheme = document.getElementById('theme')
const saveTheme = localStorage.getItem('selectedTheme');

const timer = document.querySelector('.timer')

const tileStatus = {
    hidden:'hidden',
    mine:'mine',
    number:'number',
    marked:'marked',
}

let gridSize = 9;
let numberOfMines = 9;
let timeTick = 0;
let timerInterval;

//Creating Grid


function createGrid(gridSize, numberOfMines){
  const grid = [];
  const minePositions = getMinePositions(gridSize,numberOfMines);

  for(let rows=0; rows<gridSize; rows++){
    const row =[];
    for(let cols=0; cols<gridSize; cols++){
      const individualTile = document.createElement('div');
      individualTile.dataset.status = tileStatus.hidden;
      
      const tiles = {
        individualTile,
        cols,
        rows,
        mine: minePositions.some(mineMatch.bind(null,{ rows,cols })),
        get status(){
          return individualTile.dataset.status;
        },
        set status(value){
          individualTile.dataset.status = value;
        }
      }

      row.push(tiles)
    }
    grid.push(row)
  }
  return grid;
}


//Mine Positioning


function getMinePositions(gridSize,numberOfMines){
  const locations = []; //locations of the mines in array x,y

  while(locations.length < numberOfMines){
    const location = {  //random coordinates for the mine
      rows:random(gridSize),
      cols:random(gridSize)
    }

    if (!locations.some(mineMatch.bind(null,location))){
      locations.push(location); //check if mine exists on same coordinate if not then push
    }
  }
  return locations;
}

//utility funciton that makes random 
function random(size){
  return Math.floor(Math.random()*size)
}

//utility function that matches coordinates
function mineMatch(x,y){
return x.rows === y.rows && x.cols === y.cols
}


//Flagging & Flag Counting functions


//if tile is not marked and hidden mark it and if it is marked then unmark
function flagged(tiles){
  if (tiles.status !== tileStatus.hidden && tiles.status !==tileStatus.marked){
    return
  }
  if (tiles.status === tileStatus.marked){
    tiles.status = tileStatus.hidden;
    tiles.individualTile.textContent = '';
  }
  else {
    tiles.status = tileStatus.marked;
    tiles.individualTile.textContent = 'O';
  }
}

//decrements flagscount by 1 or increments by 1 depending on removal or addition
function flagCount(){
  const flaggedTiles = grid.reduce((count,row)=>{
    return count + row.filter(tiles => tiles.status === tileStatus.marked).length
  },0);
  flagsLeftElement.textContent = numberOfMines-flaggedTiles;
}


//Revealing tile and check surrounding tiles function


function reveal(grid, tiles){
  if(tiles.status !== tileStatus.hidden){
    return;
  }
  if (tiles.mine){
    tiles.status = tileStatus.mine;
    tiles.individualTile.textContent = 'X'
    return;
  }
  else
  tiles.status = tileStatus.number;
  const checkSurround = surroundingTiles(grid,tiles)
  const mines = checkSurround.filter(t => t.mine)
  if (mines.length === 0){
    checkSurround.forEach(reveal.bind(null,grid))
  }
  else{
    tiles.individualTile.textContent = mines.length;
  }
}

function surroundingTiles(grid,{rows,cols}){
  const surrounding = [];
  for (let rowsOffset = -1; rowsOffset<=1; rowsOffset++){
    for (let colsOffset = -1; colsOffset<=1; colsOffset++){
      const tiles = grid [rows +rowsOffset]?.[cols +colsOffset]
      if(tiles) surrounding.push(tiles)
    }
  }
  return surrounding;
}


//Win and Lose conditions and functions

function checkWin(grid){
return grid.every(row=>{
  return row.every(tiles=>{
    return tiles.status === tileStatus.number || (tiles.mine && (tiles.status===tileStatus.hidden || tiles.status === tileStatus.marked))
  })
})
}

function checkLose(grid){
return grid.some(row=>{
  return row.some(tiles=>{
    return tiles.status === tileStatus.mine;
})
})
}

function gameStatus(){
  const win = checkWin(grid);
  const lose = checkLose(grid);

  if (win||lose){
    stopTimer()
    gridElement.addEventListener('click', stopProp, {capture :true})
    gridElement.addEventListener('contextmenu', stopProp, {capture :true})
  }

  if (win){
    flagTextElement.textContent = 'You Win'
  }
   if (lose){
    flagTextElement.textContent = 'You lose'
    grid.forEach(row=>{
      row.forEach(tiles=>{
        if(tiles.status === tileStatus.marked) flagged(tiles);
        if(tiles.mine) reveal(grid,tiles)
      })
    })
  }
}


function stopProp(e){
  e.stopImmediatePropagation()
}




//Rendering the grid
const grid = createGrid(gridSize,numberOfMines);
grid.forEach(row=>{
  row.forEach(tiles=>{
    gridElement.append(tiles.individualTile);
    tiles.individualTile.addEventListener('click', ()=>{
      reveal(grid, tiles);
      gameStatus();
      startTimer();
    })
    tiles.individualTile.addEventListener('contextmenu',e =>{
      e.preventDefault();
      flagged(tiles);
      flagCount();
    })
  })
})

gridElement.style.setProperty('--gs', gridSize)

flagsLeftElement.textContent = numberOfMines;





//Themes
if(saveTheme){
  selectTheme.value = saveTheme;  //checks if current value is equal to the savetheme value
  document.body.setAttribute('data-theme',saveTheme)
}
else{ //if it isnt it sets the current value
  document.body.setAttribute('data-theme',selectTheme.value)
}

selectTheme.addEventListener('click',e=>{
const selectedTheme = e.target.value; //adds event listener to check for which value is active 
document.body.setAttribute('data-theme', selectedTheme);
localStorage.setItem('selectedTheme',selectedTheme) //push active value to the local storage of saved theme
})



//Timer

function startTimer(){
  if(timerInterval) return // so that timer doesnt increment with each click
  timerInterval = setInterval(()=>{ //timer interval that will increase by 1 every 1 second
    timeTick++;
    timer.textContent = `${String(timeTick).padStart(3, '0')}`; //formats time as 000
  },1000)
}


function stopTimer(){ //stops the timerinterval to whatever was the last value
  clearInterval(timerInterval);
}