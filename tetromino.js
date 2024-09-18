// tetromino.js
import { collision } from './utils.js';
import { grid, gridWidth, gridHeight } from './grid.js';

// Tetromino definitions
export const tetrominoes = {
    I: {
        shape: [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],
        color: '#0C96A2',
    },
    O: {
        shape: [
            [1, 1],
            [1, 1],
        ],
        color: '#ff0',
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        color: '#a0f',
    },
    L: {
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ],
        color: '#f90',
    },
    J: {
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ],
        color: '#00f',
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
        color: '#0f0',
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
        color: '#f00',
    },
};

// Rotate a 2D array (tetromino shape) clockwise
export function rotate(matrix) {
    return matrix[0]
        .map((_, index) => matrix.map((row) => row[index]))
        .reverse();
}

// Tetris bag logic
let bag = []; // The current bag of tetrominoes

function shuffleBag() {
    const tetrominoKeys = Object.keys(tetrominoes);
    const newBag = [...tetrominoKeys];

    for (let i = newBag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newBag[i], newBag[j]] = [newBag[j], newBag[i]];
    }

    return newBag;
}

export function getNextTetromino(position) {
    if (bag.length === 0) {
        bag = shuffleBag(); // Refill the bag when it's empty
    }

    const nextTetrominoKey = bag.shift(); // Remove the first element from the bag
    const newTetromino = tetrominoes[nextTetrominoKey];

    // Calculate the correct starting x position for each tetromino
    switch (nextTetrominoKey) {
        case 'O':
            position.x = Math.floor((2 - 2) / 2);
            break;
        case 'I':
            position.x = Math.floor((4 - 4) / 2);
            break;
        case 'J':
            position.x = Math.floor((3 - 3) / 2) + 1;
            break;
        case 'L':
        case 'T':
        case 'S':
        case 'Z':
            position.x = Math.floor((3 - 3) / 2);
            break;
        default:
            position.x = Math.floor((3 - 3) / 2);
    }

    position.y = 0; // Reset the y position for new tetromino

    return newTetromino;
}
