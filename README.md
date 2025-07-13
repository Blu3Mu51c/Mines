
# Mines (Minesweeper Clone)
Minesweeper is a logic puzzle video game genre generally played on personal computers. The game features a grid of clickable tiles, with hidden mines dispersed throughout the board. The objective is to clear the board without detonating any mines, with help from clues about the number of neighboring mines in each field. 


## Game
* Player is greeted with a welcome title and game name.
* Player is prompted to enter `gridSize` and `numberOfMines`
### Grid
* Grid of clickable tiles presented to the player.
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
### Reset
* A reset button is present for the player.
* Reset button resets the game back to new game.
### Timer
* A timer is present at the top.
* Timer lets the player know the amount of time he has taken to win the game.

## Game Logic (Pseudocode)
* HTML setup
    * Game title
    * Grid
    * Flag Amount
    * Timer
    * Winning message
    * Losing message
    * Play again button
* CSS
    * Styling
* Javascript setup
    * 2D Array Grid
    * tile = Covered, Revealed, Flagged
    * Variables
        * winner = boolean;
        * loser = boolean;
    * Left Click = Reveal;
    * Right Click = Flag;

Grid made using [i][j] or [i][i] where i and j are integers.

After game starts (on player click) generate limited number of mines randomly all across using math.random method.

Iterate through the 2d array and find all mines and scan each tile in contact with each mine horizontally, vertically and diagonally.

`mine.contact++;`

When tile is clicked that is in contact with a mine/mines reveal only that tile with a number & color representing the amount of mines in contact.

```
If tile === mine loser = true;
Message = You Lost;
Timer stop;

If all mines === flagged winner = true;
Message = You Won;
Timer stop;
```

reset onClick 
```
all tiles = covered;
winner = false;
loser = false;
timer = null;
```

![Mine](./assets/Mine.png)