class Board {
   constructor() {
       this.data = [[]];
       this.size = {x: 0, y: 0};
       this.condition = 1;
       this.player = true;
       this.mark = [];
       this.mark[0] = 'o';
       this.mark[1] = 'x';
   }
   clear() {
       this.data.length = 0;
   }
   setSize(x, y) {
       this.size.x = x;
       this.size.y = y;
   }
   getSize() {
       return this.size;
   }
   getEmptyMark() {
       return '&nbsp&nbsp';
   }
   init() {
       this.player = true;
       this.data.length = this.size.x;
       for (let x = 0; x < this.size.x; ++x) {
           if (!this.data[x])
              this.data[x] = [];
           this.data[x].length = this.size.y;
           for (let y = 0; y < this.size.y; ++y) {
               if (!this.data[x][y])
                  this.data[x][y] = {x: x, y: y, string: ''};
               this.data[x][y].string = this.getEmptyMark();
           }
       }
   }
   getData() {
       return this.data.reduce((a, b) => a.concat(b));
   }
   getDataRow() {
       return this.data;
   }
   getField(x, y) {
       return this.data[x][y];
   }
   setCondition(value) {
       this.condition = value;
   }
   getCondition() {
       return this.condition;
   }
   switchPlayers() {
       this.player = !this.player;
   }
   playerOnMove() {
       return this.mark[+this.player];
   }
}

class AI {
    constructor() {
        this.board;
        this.condition = 0;
        this.size = {x: 0, y: 0};
        this.x = -1;
        this.y = -1;
    }
    setBoard(board) {
        this.board = board;
        this.condition = this.board.getCondition();
        this.size = this.board.getSize();
    }
    makeMove() {
        let x = -1;
        let y = -1;
        do {
          x = Math.ceil(Math.random() * this.size.x);
          y = Math.ceil(Math.random() * this.size.y);
        } while (!click(x, y));
        this.x = x;
        this.y = y;
    }
}

const board = new Board();
const ai = new AI();
let gameState = false;

function addField(x, y) {
    board.AddField(x, y);
}

function  click(x, y) {
    const size = board.getSize();
    if (x < 0 || y < 0 || x > size.x - 1 || y > size.y - 1)
      return false;
    const field = board.getField(x, y);
    if (field.string != board.getEmptyMark())
       return false;
    field.string = board.playerOnMove();
    field.button.classList.add('player'+board.playerOnMove());
    field.button.innerHTML = field.string;
    return true;
}

function checkLine(line, condition, mark) {
    const data = board.getDataRow();
    const size = board.getSize().y;
    let n = 0;
    let winning = [];
    for (let col = 0; col < size; ++col) {
       if (data[line][col].string == mark) {
           n++;
           winning.push(data[line][col].button);
           if (n == condition)
             return winning;
       } else {
           n = 0;
           winning.length = 0;
       }
    }
    return false;
}
function checkCol(col, condition, mark) {
    const data = board.getDataRow();
    const size = board.getSize().x;
    let n = 0;
    let winning = [];
    for (let line = 0; line < size; ++line) {
       if (data[line][col].string == mark) {
           n++;
           winning.push(data[line][col].button);
           if (n == condition)
             return winning;
       } else {
           n = 0;
           winning.length = 0;
       }
    }
    return false;
}
function checkDiagLU(line, col, condition, mark) {
    let n = 1;
    const data = board.getDataRow();
    const size = board.getSize();
    let winning = [];
    winning.push(data[line][col].button);
    let x = line - 1;
    let y = col + 1;
    while (n < condition && data[x] && data[x][y] && data[x][y].string == mark) {
        winning.push(data[x][y].button); n++; x--; y++;
    }
    x = line + 1;
    y = col - 1;
    while (n < condition && data[x] && data[x][y] && data[x][y].string == mark) {
        winning.push(data[x][y].button); n++; x++; y--;
    }
    if (n < condition)
       return false;
    return winning;
}
function checkDiagLD(line, col, condition, mark) {
   let n = 1;
   const data = board.getDataRow();
   const size = board.getSize();
   let winning = [];
   winning.push(data[line][col].button);
   let x = line - 1;
   let y = col - 1;
   while (n < condition && data[x] && data[x][y] && data[x][y].string == mark) {
    winning.push(data[x][y].button); n++; x--; y--;
   }
   x = line + 1;
   y = col + 1;
   while (n < condition && data[x] && data[x][y] && data[x][y].string == mark) {
    winning.push(data[x][y].button); n++; x++; y++;
   }
   if (n < condition)
      return false;
   return winning;
}
function checkDiag(line, col, condition, mark) {
    return checkDiagLD(line, col, condition, mark) || checkDiagLU(line, col, condition, mark);
}
function isWin(x, y) {
    const condition = board.getCondition();
    const mark = board.getField(x, y).string;
    if (mark == board.getEmptyMark())
      return false;
    return checkLine(x, condition, mark) ||
           checkCol(y, condition, mark) ||
           checkDiag(x, y, condition, mark);
}

function switchPlayers() {
    board.switchPlayers();
}

function colorPlayer(data) {
    data.forEach((item) => {
        item.classList.add('win');
    });
}

function initGame(sizeX, sizeY, condition) {
    const parent = document.getElementById('board');
    board.clear();
    board.setSize(sizeX, sizeY);
    board.setCondition(condition);
    board.init();
    ai.setBoard(board);
    gameState = false;
    let counter = 0;
    board.getData().forEach((field) => {
        const htmlField = document.createElement('button');
        htmlField.innerHTML = field.string;
        field.button = htmlField;
        htmlField.addEventListener('click', (ev) => {
            if (gameState)
              return;
            ev.preventDefault();
            if (click(field.x, field.y)) {
              let winning = isWin(field.x, field.y);
              if (winning) {
                //  console.log("Player " + board.playerOnMove() + ' WON');
                  console.log("You WON");
                  colorPlayer(winning);
                  gameState = true;
                  return;
              }
              switchPlayers();
              ai.makeMove();
              let w2 = isWin(ai.x, ai.y);
              if (w2) {
                //  console.log("Player " + board.playerOnMove() + ' WON');
                  console.log("You Lost");
                  colorPlayer(w2);
                  gameState = true;
                  return;
              }
              switchPlayers();
            }
        });
        counter++;
        parent.appendChild(htmlField);
        if (counter == sizeX) {
          parent.appendChild(document.createElement('br'));
          counter = 0;
        }
    });
}
window.onload = () => {
  initGame(10, 10, 3);
}