/* eslint-disable linebreak-style */
/* eslint-disable curly */
/* eslint-disable require-jsdoc */
const board = [[]];
const boardSizeX = 10;
const boardSizeY = 10;
const mineCount = Math.ceil((boardSizeX + boardSizeY) / 2);
let markedMines = mineCount;
let nToOpen = 0;
let time = 0;
let timerID;

const ST_MARKED = 1;
const ST_CLOSED = 2;
const ST_OPEN = 3;

const G_IN_PROGRESS = 1;
const G_WON = 2;
const G_LOST = 3;

let gameStatus = G_IN_PROGRESS;

class Tile {
  constructor() {
    this.state = ST_CLOSED;
    this.field = undefined;
  }
  toString() {
    switch (this.state) {
      case ST_OPEN: return '&nbsp&nbsp';
      case ST_CLOSED: return '&nbsp&nbsp';
      case ST_MARKED: return 'F';
      default: return '?';
    }
  };
  mark() {
    if (this.state == ST_CLOSED) {
      this.state = ST_MARKED;
      return true;
    } else if (this.state == ST_MARKED) {
      this.state = ST_CLOSED;
      return true;
    }
    return false;
  };
  open() {
    if (this.state != ST_CLOSED)
      return false;
    this.state = ST_OPEN;
    return true;
  };
  isMine() {
    return false;
  };
}

class Mine extends Tile {
  toString() {
    if (this.state == ST_OPEN || gameStatus != G_IN_PROGRESS)
      return 'X';
    return super.toString();
  };
  isMine() {
    return true;
  }
  open() {
    if (this.state != ST_CLOSED)
      return false;
    this.state = ST_OPEN;
    return true;
  }
}
class Clue extends Tile {
  constructor() {
    super();
    this.value = 0;
  };
  toString() {
    if (this.state == ST_OPEN && this.value)
      return this.value;
    return super.toString();
  };
};

function updateRemaingMines() {
  document.getElementById('labRemM').innerHTML = markedMines;
}

function checkWinLos(x, y) {
  if (gameStatus != G_IN_PROGRESS)
    return;

  if (x < 0 || x > boardSizeX - 1 ||
    y < 0 || y > boardSizeY - 1)
    return;

  if (board[x][y].isMine())
    gameStatus = G_LOST;
  else if (!nToOpen)
    gameStatus = G_WON;

  if (gameStatus == G_LOST) {
    console.log('%cYOU LOST :(', 'color: red');
    stopTimer();
    revealMines();
  }
  if (gameStatus == G_WON) {
    console.log('%cYOU WON :)', 'color: green');
    stopTimer();
    revealMines();
  }
}

function initHtml() {
  const parent = document.getElementById('board');
  parent.innerHTML = '';
  for (let x = 0; x < board.length; ++x) {
    for (let y = 0; y < board[x].length; ++y) {
      const button = document.createElement('button');
      button.innerHTML = board[x][y].toString();
      button.addEventListener('contextmenu', (ev)=> {
        ev.preventDefault();
        markE(x, y);
        button.innerHTML = board[x][y].toString();
      });
      button.addEventListener('click', (ev) => {
        ev.preventDefault();
        if (openE(x, y))
          checkWinLos(x, y);
        if (board[x][y].isMine() && board[x][y].state == ST_OPEN) {
          button.classList.add('exploded');
        }
        button.innerHTML = board[x][y].toString();
      });
      board[x][y].field = button;
      parent.appendChild(button);
    }
    parent.appendChild(document.createElement('br'));
  }

  updateRemaingMines();
}

function addC(x, y) {
  if (x < 0 || x > boardSizeX - 1 ||
        y < 0 || y > boardSizeY -1) {
    return false;
  }
  return board[x][y] && board[x][y].isMine();
}

function init() {
  gameStatus = G_IN_PROGRESS;
  markedMines = mineCount;
  // clear board first
  board.length = 0;
  board.length = boardSizeX;
  nToOpen = 0;
  let mn = mineCount;
  for (let x = 0; x < boardSizeX; ++x) {
    if (board[x] == undefined)
      board[x] = [];
    board[x].length = boardSizeY;
  }

  while (mn) {
    const rRow = Math.floor((Math.random() * boardSizeX));
    const rCol = Math.floor((Math.random() * boardSizeY));
    if (board[rRow][rCol] == undefined) {
      board[rRow][rCol] = new Mine();
      mn--;
    }
  }

  for (let x = 0; x < boardSizeX; ++x) {
    for (let y = 0; y < boardSizeY; ++y) {
      if (board[x][y] == undefined) {
        board[x][y] = new Clue();
        let m = 0;
        if (addC(x+1, y)) m++;
        if (addC(x-1, y)) m++;
        if (addC(x+1, y+1)) m++;
        if (addC(x-1, y+1)) m++;
        if (addC(x+1, y-1)) m++;
        if (addC(x-1, y-1)) m++;
        if (addC(x, y+1)) m++;
        if (addC(x, y-1)) m++;
        board[x][y].value = m;
        nToOpen++;
      }
    }
  }

  initHtml();
  startTimer();
}

function timeTick() {
  time++;
  document.getElementById('labTime').innerHTML = time;
}

function startTimer() {
  time = 0;
  if (timerID)
    clearInterval(timerID);
  timerID = setInterval(() => {
    timeTick();
  }, 1000);
  document.getElementById('labTime').innerHTML = time;
}

function stopTimer() {
  clearInterval(timerID);
  timerID = undefined;
  document.getElementById('labTime').innerHTML = time;
}

window.onload = () => {
  init();
  startTimer();
  document.getElementById('btnNewGame').addEventListener('click', () => {
    init();
  });
};

function getCoordinates(str) {
  str = str.trim();
  return [str.charCodeAt(0)-65, +str.slice(1).trim()-1];
}

function recursiveOpen(x, y) {
  if (
    x < 0 || x > boardSizeX - 1 ||
        y < 0 || y > boardSizeY -1) {
    return;
  }
  if (board[x][y].state == ST_OPEN ||
        board[x][y].isMine())
    return;

  if (!board[x][y].open())
    return;

  nToOpen--;
  board[x][y].field.classList.add('opened');
  board[x][y].field.innerHTML = board[x][y].toString();

  if (board[x][y].value === 0) {
    const f = [[1, 0], [-1, 0], [1, 1], [-1, 1],
      [1, -1], [-1, -1], [0, 1], [0, -1]];
    for (let i = 0; i < f.length; ++i)
      recursiveOpen(x + f[i][0], y + f[i][1]);
  }
}

function revealMines() {
  for (let x = 0; x < boardSizeX; ++x) {
    for (let y = 0; y < boardSizeY; ++y) {
      if (board[x][y].isMine())
        board[x][y].field.innerHTML = board[x][y].toString();
    }
  }
}

function openE(x, y) { // eslint-disable-line no-unused-vars
  if (gameStatus != G_IN_PROGRESS)
    return false;

  if (x < 0 || x > boardSizeX - 1 ||
    y < 0 || y > boardSizeY - 1)
    return false;

  if (!board[x][y].open())
    return false;

  if (!board[x][y].isMine())
    nToOpen--;

  board[x][y].field.classList.add('opened');
  if (board[x][y].value === 0) {
    const f = [[1, 0], [-1, 0], [1, 1], [-1, 1],
      [1, -1], [-1, -1], [0, 1], [0, -1]];
    for (let i = 0; i < f.length; ++i)
      recursiveOpen(x + f[i][0], y + f[i][1]);
  }
  return true;
}

function markE(x, y) {
  if (gameStatus != G_IN_PROGRESS)
    return;
  if (x < 0 || x > boardSizeX - 1 ||
    y < 0 || y > boardSizeY - 1)
    return;
  if (board[x][y].mark()) {
    if (board[x][y].state == ST_MARKED)
      markedMines--;
    else
      markedMines++;
    updateRemaingMines();
  }
}

function open(str) { // eslint-disable-line no-unused-vars
  if (gameStatus != G_IN_PROGRESS)
    return;
  const c = getCoordinates(str);
  if (openE(c[0], c[1]))
    checkWinLos(c[0], c[1]);
}
function mark(str) { // eslint-disable-line no-unused-vars
  if (gameStatus != G_IN_PROGRESS)
    return;
  const c = getCoordinates(str);
  markE(c[0], c[1]);
}
