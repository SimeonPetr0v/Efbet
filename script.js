// script.js
const gridSize = 5;
const mineCount = 5;
let gameOver = false;
let safeTilesClicked = 0;
const gameContainer = document.getElementById('game-container');
const messageDisplay = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

// Create the game grid
function createGrid() {
    gameContainer.innerHTML = '';
    gameOver = false;
    safeTilesClicked = 0;
    messageDisplay.textContent = 'Click a tile to start!';

    const tiles = Array(gridSize * gridSize).fill(0);
    let minePositions = [];

    while (minePositions.length < mineCount) {
        const randomPos = Math.floor(Math.random() * tiles.length);
        if (!minePositions.includes(randomPos)) {
            minePositions.push(randomPos);
        }
    }

    tiles.forEach((_, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        if (minePositions.includes(index)) {
            tile.dataset.mine = 'true';
        }
        tile.addEventListener('click', () => handleTileClick(tile));
        gameContainer.appendChild(tile);
    });
}

// Handle clicking on a tile
function handleTileClick(tile) {
    if (gameOver || tile.classList.contains('clicked')) return;

    tile.classList.add('clicked');

    if (tile.dataset.mine) {
        tile.classList.add('mine');
        messageDisplay.textContent = 'Game Over! You hit a mine!';
        gameOver = true;
        revealAllMines();
    } else {
        safeTilesClicked++;
        tile.textContent = 'Safe';
        if (safeTilesClicked === (gridSize * gridSize - mineCount)) {
            messageDisplay.textContent = 'Congratulations! You won!';
            gameOver = true;
        }
    }
}

// Reveal all mines when the game is over
function revealAllMines() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        if (tile.dataset.mine) {
            tile.classList.add('mine');
        }
    });
}

// Restart the game
restartBtn.addEventListener('click', createGrid);

// Initialize the game on page load
createGrid();
