// game.js
import { getNextTetromino, tetrominoes, rotate } from './tetromino.js';
import { collision } from './utils.js';
import {
    grid,
    gridWidth,
    gridHeight,
    drawGrid,
    drawTetromino,
    drawNextTetromino,
    drawHeldTetromino,
} from './grid.js';

// Game State Variables
let position = { x: 3, y: 0 }; // Initialize position
let tetromino = getNextTetromino(position); // Get the first tetromino
let nextTetromino = getNextTetromino({ x: 3, y: 0 }); // Initialize the next tetromino
let nextTetrominoKey = getTetrominoKey(nextTetromino); // Function to find the key
let lastTime = 0;
const dropSpeed = 1000; // Fixed drop speed in milliseconds
let score = 0;
let timeLeft = 180; // 3 minutes in seconds
let heldTetromino = null; // The currently held tetromino
let holdAllowed = true; // To prevent multiple swaps per piece drop
let gameOver = false;
let animationId = null;

// Utility function to find the key of a tetromino
function getTetrominoKey(tetrominoObj) {
    return Object.keys(tetrominoes).find(
        (key) => tetrominoes[key] === tetrominoObj
    );
}

function restartGame() {
    // Reset the game state
    score = 0;
    timeLeft = 180;
    position = { x: 3, y: 0 }; // Reset the position
    grid.forEach((row) => row.fill(0)); // Clear the grid
    tetromino = getNextTetromino(position); // Start with a new tetromino
    nextTetromino = getNextTetromino({ x: 3, y: 0 }); // Reset the next tetromino
    nextTetrominoKey = getTetrominoKey(nextTetromino); // Get key of the next tetromino
    heldTetromino = null; // Clear held tetromino
    holdAllowed = true; // Reset hold ability

    drawNextTetromino(nextTetrominoKey, nextTetromino); // Draw the next piece
    drawGrid();
    drawTetromino(tetromino, position);
    drawHeldTetromino(null, null); // Clear the hold display

    update(); // Restart the game loop
}

function lockTetromino() {
    tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                grid[position.y + y][position.x + x] = value;
            }
        });
    });
    clearLines();
}

function clearLines() {
    let linesCleared = 0;
    // Start from the bottom row and move upwards
    for (let y = gridHeight - 1; y >= 0; ) {
        if (grid[y].every((cell) => cell !== 0)) {
            grid.splice(y, 1); // Remove the completed line
            grid.unshift(new Array(gridWidth).fill(0)); // Add a new empty line at the top
            linesCleared += 1;
            // Do not decrement y, as the next row has shifted down
        } else {
            y -= 1; // Move to the next row upwards
        }
    }
    if (linesCleared > 0) {
        switch (linesCleared) {
            case 1:
                score += 100;
                break;
            case 2:
                score += 300;
                break;
            case 3:
                score += 500;
                break;
            case 4:
                score += 800;
                break;
            default:
                break;
        }
        document.getElementById('score').textContent = score; // Update score display
    }
}

let timerInterval = null;

export function endGame() {
    gameOver = true;
    cancelAnimationFrame(animationId); // Stop the game loop
    stopTimer(); // Stop the timer
    alert('Game Over! Your score: ' + score);
    resetGame(); // Prepare for restart
    document.getElementById('start-button').disabled = false; // Re-enable Start button
}

// Start the timer when the game starts
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft -= 1;
            document.getElementById('time-left').textContent = timeLeft;
        } else {
            endGame(); // End game when time runs out
        }
    }, 1000);
}

// Stop the timer when the game ends
function stopTimer() {
    clearInterval(timerInterval);
}

export function startGame() {
    resetGame(); // Reset the game state
    tetromino = getNextTetromino({ x: 0, y: 0 });
    spawnTetromino();
    drawGrid();
    drawTetromino(tetromino, position);

    startTimer(); // Start the countdown timer

    animationId = requestAnimationFrame(update); // Start the game loop
}

function resetGame() {
    score = 0;
    timeLeft = 180;
    position = { x: 3, y: 0 };
    grid.forEach((row) => row.fill(0));
    tetromino = null;
    nextTetromino = getNextTetromino({ x: 0, y: 0 });
    nextTetrominoKey = getTetrominoKey(nextTetromino);
    heldTetromino = null;
    holdAllowed = true;
    gameOver = false;

    // Update UI
    document.getElementById('score').textContent = score;
    document.getElementById('time-left').textContent = timeLeft;
    drawNextTetromino(nextTetrominoKey, nextTetromino);
    drawGrid();
    drawHeldTetromino(null, null);
}

export function dropTetromino() {
    position.y += 1;
    if (collision(tetromino, position, gridWidth, gridHeight, grid)) {
        position.y -= 1; // Revert if collision
        lockTetromino(); // Lock the current tetromino in place
        spawnTetromino(); // Spawn the next tetromino
        holdAllowed = true; // Allow holding again after drop
        if (collision(tetromino, position, gridWidth, gridHeight, grid)) {
            endGame(); // Game over if the new piece collides immediately
        }
    }
}

export function holdTetromino() {
    if (!holdAllowed) return; // Only allow hold once per piece drop

    if (heldTetromino) {
        // Swap current tetromino with the held tetromino
        const tempTetromino = heldTetromino;
        heldTetromino = tetromino;
        tetromino = tempTetromino;
        position = { x: 3, y: 0 }; // Reset the position
    } else {
        // Hold the current tetromino and get the next one
        heldTetromino = tetromino;
        tetromino = nextTetromino;
        nextTetromino = getNextTetromino({ x: 3, y: 0 });
        nextTetrominoKey = getTetrominoKey(nextTetromino);
        drawNextTetromino(nextTetrominoKey, nextTetromino); // Update next piece display
    }

    // Get the key of the held tetromino for drawing
    const heldTetrominoKey = heldTetromino
        ? getTetrominoKey(heldTetromino)
        : null;
    drawHeldTetromino(heldTetrominoKey, heldTetromino); // Draw the held piece

    holdAllowed = false; // Disable further holds until next piece drop
}

export function spawnTetromino() {
    tetromino = nextTetromino;
    position = { x: 3, y: 0 }; // Reset the position

    // Generate the next tetromino
    nextTetromino = getNextTetromino({ x: 3, y: 0 });
    nextTetrominoKey = getTetrominoKey(nextTetromino);

    drawNextTetromino(nextTetrominoKey, nextTetromino); // Draw the next piece

    // Check for collisions immediately after spawning
    if (collision(tetromino, position, gridWidth, gridHeight, grid)) {
        endGame(); // End the game if the tetromino collides on spawn
    }
}

export function moveTetromino(direction) {
    position.x += direction;
    if (collision(tetromino, position, gridWidth, gridHeight, grid)) {
        position.x -= direction; // Revert movement if collision
    }
}

const wallKickOffsets = [
    { x: 0, y: 0 }, // No shift
    { x: -1, y: 0 }, // Shift left
    { x: 1, y: 0 }, // Shift right
    { x: -1, y: -1 }, // Shift left and up
    { x: 1, y: -1 }, // Shift right and up
];

export function rotateTetromino() {
    const rotatedShape = rotate(tetromino.shape);
    const rotatedTetromino = { ...tetromino, shape: rotatedShape };

    // Attempt to rotate without shifting
    if (!collision(rotatedTetromino, position, gridWidth, gridHeight, grid)) {
        tetromino.shape = rotatedShape;
        return;
    }

    // Attempt wall kicks
    for (let offset of wallKickOffsets) {
        const newPosition = {
            x: position.x + offset.x,
            y: position.y + offset.y,
        };
        const shiftedTetromino = { ...rotatedTetromino, position: newPosition };

        if (
            !collision(
                shiftedTetromino,
                newPosition,
                gridWidth,
                gridHeight,
                grid
            )
        ) {
            tetromino.shape = rotatedShape;
            position = newPosition;
            return;
        }
    }

    // If all wall kicks fail, do not rotate
}

export function rotateClockwise() {
    rotateTetromino();
}

// Initial Drawing
drawNextTetromino(nextTetrominoKey, nextTetromino);
drawGrid();
drawTetromino(tetromino, position);

function update(time = 0) {
    const deltaTime = time - lastTime;

    if (deltaTime > dropSpeed) {
        dropTetromino();
        lastTime = time;
    }

    drawGrid();
    drawTetromino(tetromino, position);
    drawNextTetromino(nextTetrominoKey, nextTetromino); // Draw the next piece
    if (heldTetromino) {
        const heldTetrominoKey = getTetrominoKey(heldTetromino);
        drawHeldTetromino(heldTetrominoKey, heldTetromino); // Draw the held piece
    }

    requestAnimationFrame(update);
}
