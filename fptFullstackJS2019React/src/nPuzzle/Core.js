export const GameStateEnum = { PLAYING: 1, WON: 2};

export class Stone {constructor(value) {this.value = value}}
export class Empty {constructor() {this.nothing = true}}

export class Field {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.stoneCount = (this.rows * this.columns) - 1;
        this.stones = [];
        this.gameState = GameStateEnum.PLAYING;
        this.freePositon = {};
        this.direction = {
            DOWN: [1, 0],
            UP: [-1, 0],
            LEFT: [0, -1],
            RIGTH: [0, 1]
        }
        this.generateAndShuffle(true);
    }

    generateAndShuffle = (hack) => {
        this.stones = [];
        this.gameState = GameStateEnum.PLAYING;

        for (let row = 0; row < this.rows; ++row) {
            this.stones.push([]);
            this.stones[row].length = this.columns;
        }

        if (hack) {
            let value = 1;
            for (let row = 0; row < this.rows; ++row) {
                for (let col = 0; col < this.columns; ++col) {
                    if (value === this.stoneCount + 1) {
                        this.stones[row][col] = new Empty();
                        this.freePositon.x = row;
                        this.freePositon.y = col;
                    }
                    else
                        this.stones[row][col] = new Stone(value);
                    value++;
                }
            }
            return;
        }
        for (let value = 1; value <= this.stoneCount; ++value) {
            const randomRow = Math.floor(Math.random() * this.rows);
            const randomCol = Math.floor(Math.random() * this.columns);

            if (this.stones[randomRow][randomCol]) {
                --value;
                continue;
            }
            this.stones[randomRow][randomCol] = new Stone(value);
        }

        for (let row = 0; row < this.rows; ++row) {
            for (let col = 0; col < this.columns; ++col) {
                if (!this.stones[row][col]) {
                    // need something here, else we cannot use map
                    this.stones[row][col] = new Empty();
                    this.freePositon.x = row;
                    this.freePositon.y = col;
                    return;
                }
            }
        }
    }

    swap = (row, col, toRow, toCol) => {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.columns)
            return false;
        if (toRow < 0 || toRow >= this.rows || toCol < 0 || toCol >= this.columns)
            return false;
        if (!this.stones[toRow][toCol].nothing)
            return false;
        this.stones[toRow][toCol] = new Stone(this.stones[row][col].value);
        this.stones[row][col] = new Empty();
        this.freePositon.x = row;
        this.freePositon.y = col;
        return true;
    }
    move = (row, col) => {
        if (this.stones[row][col].nothing)
            return;
        const m = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        for (let direction of m) {
            if (this.swap(row, col, row + direction[0], col + direction[1])) {
                this.checkWin();
                return;
            }
        }
    }
    moveDir = (direction) => {
        const row = this.freePositon.x;
        const col = this.freePositon.y;
        if (this.swap(row - direction[0], col - direction[1] ,row, col))
            this.checkWin();
    }
    checkWin = () => {
        // Last has to be empty
        if (!this.stones[this.rows-1][this.columns-1].nothing)
            return false;
        let prev = 0;
        for (let x = 0; x < this.rows; ++x) {
            for (let y = 0; y < this.columns; ++y) {
                if (this.stones[x][y].value !== prev + 1)
                    return false;
                prev = this.stones[x][y].value;
                if (prev === this.stoneCount) {
                    this.gameState = GameStateEnum.WON;
                    return true;
                }
            }
        }
        return false;
    }
}