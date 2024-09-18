// grid.js
export const gridWidth = 10;
export const gridHeight = 20;
export let grid = Array.from({ length: gridHeight }, () =>
    Array(gridWidth).fill(0)
);

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// Set up the grid size (10 columns, 20 rows)
const blockSize = 32; // Each block will be 32x32 pixels

context.scale(blockSize, blockSize);

// Draw the game grid with lines and locked tetrominoes
export function drawGrid() {
    context.fillStyle = '#000'; // Set the grid background to black
    context.fillRect(0, 0, gridWidth, gridHeight); // Fill the entire grid area

    // Draw the locked tetrominoes
    for (let y = 0; y < gridHeight; ++y) {
        for (let x = 0; x < gridWidth; ++x) {
            if (grid[y][x] !== 0) {
                context.fillStyle = '#666'; // Color for locked tetrominoes
                context.fillRect(x, y, 1, 1);
            }
        }
    }

    // Draw the grid lines
    context.strokeStyle = '#444'; // Set the line color to a dark gray
    context.lineWidth = 0.05; // Set the line thickness to be very thin

    for (let x = 0; x < gridWidth; ++x) {
        for (let y = 0; y < gridHeight; ++y) {
            context.strokeRect(x, y, 1, 1); // Draw a square for each cell
        }
    }
}

const nextCanvas = document.getElementById('next-piece');
const nextContext = nextCanvas.getContext('2d');

// Scale for next tetromino display (adjust as necessary)
const nextBlockSize = 32;
nextContext.scale(nextBlockSize, nextBlockSize);

export function drawNextTetromino(nextTetrominoKey, nextTetromino) {
    nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height); // Clear the canvas first

    // Default offsets (these can be tweaked as needed for each tetromino)
    let offsetX = 0;
    let offsetY = 0;

    // Adjust centering based on the tetromino type
    switch (nextTetrominoKey) {
        case 'I': // I Tetromino (4x1)
            offsetX = 0; // Center the I piece horizontally
            offsetY = 0; // Lower it a bit to look better
            break;
        case 'O': // O Tetromino (2x2)
            offsetX = 1; // Center it
            offsetY = 1; // Center it
            break;
        case 'T': // T Tetromino (3x3)
            offsetX = 0; // Center the T piece
            offsetY = 1; // Raise it a little
            break;
        case 'L': // L Tetromino (3x3)
            offsetX = 0;
            offsetY = 0;
            break;
        case 'J': // J Tetromino (3x3)
            offsetX = 1;
            offsetY = 0;
            break;
        case 'S': // S Tetromino (3x3)
            offsetX = 0;
            offsetY = 1;
            break;
        case 'Z': // Z Tetromino (3x3)
            offsetX = 0;
            offsetY = 1;
            break;
        default:
            offsetX = 1; // Default centering for any other piece
            offsetY = 1;
    }

    // Draw the tetromino centered based on manual offsets
    nextTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                nextContext.fillStyle = nextTetromino.color; // Use the color of the tetromino
                nextContext.fillRect(offsetX + x, offsetY + y, 1, 1); // Draw the block centered
            }
        });
    });
}

const holdCanvas = document.getElementById('hold-piece');
const holdContext = holdCanvas.getContext('2d');

// Scale for hold tetromino display
const holdBlockSize = 32;
holdContext.scale(holdBlockSize, holdBlockSize);

export function drawHeldTetromino(heldTetrominoKey, heldTetromino) {
    holdContext.clearRect(0, 0, holdCanvas.width, holdCanvas.height); // Clear the canvas first

    if (!heldTetromino || !heldTetromino.shape) {
        return; // Don't draw anything if there's no held piece
    }

    // Default offsets to center the piece in the hold box
    let offsetX = 1;
    let offsetY = 1;

    switch (heldTetrominoKey) {
        case 'I':
            offsetX = 1;
            offsetY = 2;
            break;
        case 'O':
            offsetX = 2;
            offsetY = 2;
            break;
        default:
            offsetX = 1;
            offsetY = 1;
    }

    heldTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                holdContext.fillStyle = heldTetromino.color; // Use the color of the tetromino
                holdContext.fillRect(offsetX + x, offsetY + y, 1, 1); // Draw the block centered
            }
        });
    });
}

export function drawTetromino(tetromino, position) {
    tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = tetromino.color; // Use the color of the tetromino
                context.fillRect(position.x + x, position.y + y, 1, 1);
            }
        });
    });
}
