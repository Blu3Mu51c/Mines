## Variables
```
let gridSize;
let numberOfMines;
let timeTick = 0;
let timerInterval;
```


# Step 1 Making the Grid and printing it

```
const gridElement = document.querySelector('.grid')
let gridSize = 2;
let numberOfMines = 1;


function createGrid(gridSize, numberOfMines){
  const grid = [];
  for(let rows=0; rows<gridSize; rows++){
    const row =[];
    for(let cols=0; cols<gridSize; cols++){
      const individualTile = document.createElement('div');
      const tiles = {
        individualTile,
        cols,
        rows,
      }
      row.push(tiles)
    }
    grid.push(row)
  }
  return grid;
}

const grid = createGrid(gridSize,numberOfMines);
grid.forEach(row=>{
  row.forEach(tiles=>{
    gridElement.append(tiles.individualTile);
    tiles.individualTile.addEventListener('click', ()=>{
    })
    tiles.individualTile.addEventListener('contextmenu',e =>{
      e.preventDefault();
    })
  })
})

gridElement.style.setProperty('--gs', gridSize)
```



# Step 2 Mine Checking 
make a function to check for mine positions `const minePositions = getMinePositions(gridSize,numberOfMines);`

add `mine: minePositions.some(mineMatch.bind(null,{ rows,cols })),` object value to the tiles object in grid.

```
function getMinePositions(gridSize,numberOfMines){
  const locations = [];
  while(locations.length < numberOfMines){
    const location = {
      rows:random(gridSize),
      cols:random(gridSize)
    }
    if (!locations.some(mineMatch.bind(null,location))){
      locations.push(location);
    }
  }
  return locations;
}

function random(size){
  return Math.floor(Math.random()*size)
}

function mineMatch(x,y){
return x.rows === y.rows && x.cols === y.cols
}
```
## Objects

```
const tileStatus = {
  hidden:'hidden',
  mine:'mine',
  number:'number',
  marked:'marked',
}


get status(){
  return individualTile.dataset.status;
        },

set status(value){
  individualTile.dataset.status = value;
        }
```
add get and set inside createGrid object `tiles`

# Step 3 Flagging and Unflagging + Flag Counter

```
const flagsLeftElement = document.querySelector('#flagLeft');
const flagTextElement = document.querySelector('.flagText');

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
    tiles.individualTile.textContent = '🚩';
  }
}

function flagCount(){
  const flaggedTiles = grid.reduce((count,row)=>{
    return count + row.filter(tiles => tiles.status === tileStatus.marked).length
  },0);
  flagsLeftElement.textContent = numberOfMines-flaggedTiles;
}
```
add `flagged(tiles);` and `flagCount();` in the event listener for contextmenu.

add `flagsLeftElement.textContent = numberOfMines;` at the end of the render grid.

# Step 4 Revealing tiles + Check surrounding tiles

```
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
```
add `reveal(grid, tiles);` in the event listener for 'click'.

# Step 5 Win & Loss 

```
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
    startTimer();
    stopTimer();
    gridElement.addEventListener('click', stopProp, {capture :true})
    gridElement.addEventListener('contextmenu', stopProp, {capture :true})
  }

  if (win){
    flagTextElement.textContent = `You Win`
    timer.textContent=`You won in ${timeTick}s`
  }
   if (lose){
    flagTextElement.textContent = 'Boom, You lose'
    timeTick = 0;
    grid.forEach(row=>{
      row.forEach(tiles=>{
        if(tiles.status === tileStatus.marked)flagged(tiles);
        if(tiles.mine) reveal(grid,tiles)
      })
    })
  }
}


function stopProp(e){
  e.stopImmediatePropagation()
}
```
add `gameStatus();` in the event listener for click.

# Step 6 Timer

```
const timer = document.querySelector('.timer');

function startTimer(){
  if(timerInterval) return  
  timerInterval = setInterval(()=>{  
    timeTick++;
    timer.textContent = `${String(timeTick).padStart(3, '0')}`;  
  },1000)
}


function stopTimer(){  
  clearInterval(timerInterval);
}
```

add `startTimer()` function in the event listener for 'click'
add `stopTimer()` function in the game status the moment win or loss happens

# Step 7 User Input

```
const userGrid = document.getElementById('userGrid');
const userMine = document.getElementById('userMine');
const setGridButton = document.getElementById('btn');

function setGrid(){
  gridValue = Math.floor(parseInt(userGrid.value));
  mineValue = Math.floor(parseInt(userMine.value));

  gridSize = gridValue;
  numberOfMines = mineValue;
  maxMines = gridValue*gridValue;
  console.log(maxMines)
  if(!gridValue  || !mineValue){
    gridSize = 12;
    numberOfMines = 10;
  }
  else if(mineValue>= maxMines){
    gridSize = 12;
    numberOfMines = 10;
  }
userGrid.value="";
  userMine.value="";

  }

setGridButton.addEventListener('click',setGrid())

function reloadPage(){
  location.reload();
  
}

```

# Step 8 Theme

```
const selectTheme = document.getElementById('theme')
const saveTheme = localStorage.getItem('selectedTheme');

if(saveTheme){
  selectTheme.value = saveTheme; 
  document.body.setAttribute('data-theme',saveTheme)
}
else{ 
  document.body.setAttribute('data-theme',selectTheme.value)
}

selectTheme.addEventListener('click',e=>{
const selectedTheme = e.target.value; 
document.body.setAttribute('data-theme', selectedTheme);
localStorage.setItem('selectedTheme',selectedTheme) 
})
```