// utils.js
export function collision(tetromino, position, gridWidth, gridHeight, grid) {
    for (let y = 0; y < tetromino.shape.length; ++y) {
        const row = tetromino.shape[y];
        if (!row) continue; // Skip undefined rows

        for (let x = 0; x < row.length; ++x) {
            if (row[x] !== 0) {
                if (
                    position.x + x < 0 ||
                    position.x + x >= gridWidth ||
                    position.y + y >= gridHeight ||
                    (grid[position.y + y] &&
                        grid[position.y + y][position.x + x] !== 0) // Check grid row before accessing
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}
