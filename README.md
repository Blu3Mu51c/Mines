
# Mines (Minesweeper Clone)
Minesweeper is a logic puzzle video game genre generally played on personal computers. The game features a grid of clickable tiles, with hidden mines dispersed throughout the board. The objective is to clear the board without detonating any mines, with help from clues about the number of neighboring mines in each field. 


## Game
* **Game** greets the player with a welcome title and game name.
* Player is prompted to enter `gridSize` and `numberOfMines`.
### Grid
* **Grid** of clickable tiles presented to the player.
* Player is prompted to click any tile on the grid.
* Upon clicking, Grid unveils a block of tiles to the user with numbers in some unveiled tiles representing the amount of mines the tile is in contact with.
### Mines
* **Mines** are the hurdle in the game
* If player clicks on a mine he loses the game.
* If player clears all mines he wins the game.
### Flags
* **Flags** are used to represent a mine under a veiled tile.
* Player is provided with a limited numbers of flags.
* The number of flags player has are shown to player at all times.
* Player can mark any veiled tile in the grid.
### Timer
* **Timer** is present at the top.
* The timer lets the player know the amount of time he took to clear the mines.
### Game Status
* **Game Status** lets the user know if he won or lost the game through a message

## Game Logic (Pseudocode)
* HTML setup
    * metadata
    * div for grid
    * div for flag amount
    * div for timer
    * select and options for themes
* CSS
    * Styling
    * Styling different data-statuses for tile object

* Javascript setup
    * 2D array grid with objects inside
    * object tile = Covered, Revealed, Flagged
    * Variables
        gridSize
        numberOfMines
        timer
        timeInterval
    * Left Click = 'click' =  Reveal;
    * Right Click = 'contextmenu = Flag;

Grid made using [rows][cols] where rows and cols are integers.

After game grid is set generate limited number of mines randomly all across using math.random 
on 2 random coordinates that are not already a mine.

Iterate through the 2d array using offset and find all mines and scan each tile in contact with each mine horizontally, vertically and diagonally.

When tile is clicked that is in contact with a mine/mines reveal only that tile with a number & color representing the amount of mines in contact.

![Mine](./assets/Mine.png)