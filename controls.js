// controls.js
import {
    holdTetromino,
    moveTetromino,
    dropTetromino,
    rotateTetromino,
    startGame,
} from './game.js';

document.addEventListener('keydown', handleKeyPress);
const startButton = document.getElementById('start-button');

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowLeft':
            moveTetromino(-1); // Move left
            break;
        case 'ArrowRight':
            moveTetromino(1); // Move right
            break;
        case 'ArrowDown':
            dropTetromino(); // Move down
            break;
        case 'ArrowUp':
            rotateTetromino(); // Rotate
            break;
        case 'Shift': // Handle the hold function when Shift is pressed
            holdTetromino(); // Call the hold function
            break;
    }
}

startButton.addEventListener('click', () => {
    startGame();
    startButton.disabled = true; // Disable button during game
});
