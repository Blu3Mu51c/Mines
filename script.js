const gridElement = document.querySelector('.grid');
const flagsLeftElement = document.querySelector('#flagLeft');


let gridSize = 9;
let numberOfMines = 9;

const tileStatus = {
    hidden:'hidden',
    mine:'mine',
    number:'number',
    marked:'marked',
}

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


function getMinePositions(gridSize,numberOfMines){
  const locations = []; //locations of the mines in array x,y

  while(locations.length < numberOfMines){
    const location = {  //random coordinates for the mine
      rows:random(gridSize),
      cols:random(gridSize)
    }
  }
}

//utility funciton that makes random 
function random(size){
  return Math.floor(Math.random()*size)
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








//Rendering the grid
const grid = createGrid(gridSize,numberOfMines);
grid.forEach(row=>{
  row.forEach(tiles=>{
    gridElement.append(tiles.individualTile);
      tiles.individualTile.addEventListener('click', ()=>{

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
