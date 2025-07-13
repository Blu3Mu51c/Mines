const gridElement = document.querySelector('.grid');

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

    })
  })
})

gridElement.style.setProperty('--gs', gridSize)

