const gridElement = document.querySelector('.grid');

let gridSize = 9;
let numberOfMines = 9;


//Creating Grid
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



//Rendering the grid
const grid = createGrid(gridSize,numberOfMines);
grid.forEach(row=>{
  row.forEach(tiles=>{
    gridElement.append(tiles.individualTile);
  })
})

gridElement.style.setProperty('--gs', gridSize)

