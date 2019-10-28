/* eslint-disable linebreak-style */
/* eslint-disable curly */
/* eslint-disable require-jsdoc */
const ST_MARKED = 1;
const ST_CLOSED = 2;
const ST_OPEN = 3;
const ST_REVEALED = 4;

const G_IN_PROGRESS = 1;
const G_WON = 2;
const G_LOST = 3;

class Counter {
  constructor(x) {
    this.value = Number(x);
  }
  get() {
    return this.value.valueOf();
  }
  set(x) {
    this.value = Number(x);
  }
}

class Game {
  constructor() {
    this.board;
    this.markedMines = new Counter(0);
    this.nToOpen = new Counter(0);
    this.time = new Counter(0);
    this.timerID;
    this.status = new Counter(G_IN_PROGRESS);
  }
  getTimer() {
    return this.timerID;
  }
  setTimer(x) {
    this.timerID = x;
  }
  getTime() {
    return this.time.get();
  }
  setTime(x) {
    this.time.set(x);
  }
  getToOpen() {
    return this.nToOpen.get();
  }
  setToOpen(x) {
    this.nToOpen.set(x);
  }
  setBoard(sizeX, sizeY, mineCount) {
    this.board = new Board(sizeX, sizeY, mineCount);
  }
  getBoard() {
    return this.board;
  }
  getStatus() {
    return this.status.get();
  }
  setStatus(status) {
    this.status.set(status);
  }
  setMarkedMines(value) {
    this.markedMines.set(value);
  }
  getMarkedMines() {
    return this.markedMines.get();
  }
}

class Board {
  constructor(sizeX, sizeY, mineCount) {
    this.size = {x: sizeX, y: sizeY};
    this.mineCount = mineCount;
    this.data = new Array(sizeX);
    const xArr = new Array(sizeX).fill(0).map((val, ind) => ind);
    const yArr = new Array(sizeY).fill(0).map((val, ind) => ind);
    xArr.forEach((x) => {
      this.data[x] = new Array(sizeY);
      yArr.forEach((y) => {
        this.data[x][y] = new Tile({x: x, y: y, board: this});
      });
    });
  }
  getData() {
    return this.data;
  }
  getSize() {
    return {x: this.size.x, y: this.size.y};
  }
  setTile(x, y, tile) {
    if (this.data[x][y] && this.data[x][y].field) {
      tile.field = this.data[x][y].field;
    }
    if (this.data[x][y] && this.data[x][y].board) {
      tile.board = this.data[x][y].board;
    }
    this.data[x][y] = tile;
  }
  getTile(x, y) {
    if (!this.data[x][y])
      return undefined;
    return this.data[x][y].copy();
  }
  getMineCount() {
    return this.mineCount;
  }
  toString() {
    return this.data;
  }
}

class Tile {
  constructor(tile) {
    this.state = tile ? tile.state : ST_CLOSED;
    this.field = tile ? tile.field : undefined;
    this.x = tile ? tile.x : undefined;
    this.y = tile ? tile.y : undefined;
    this.board = tile ? tile.board : undefined;
  }
  toString() {
    switch (this.state) {
      case ST_REVEALED:
      case ST_OPEN: return '&nbsp&nbsp';
      case ST_CLOSED: return '&nbsp&nbsp';
      case ST_MARKED: return 'F';
      default: return '?';
    }
  };
  copy() {
    return new Tile(this.createRepresentation(this.state));
  }
  createRepresentation(st) {
    return {
      state: st,
      field: this.field,
      x: this.x,
      y: this.y,
      board: this.board,
    };
  }
  getField() {
    return this.field;
  }
  getState() {
    return this.state;
  }
  isMine() {
    return false;
  };
  reveal() {
    return false;
  }
}

class Mine extends Tile {
  toString() {
    if (this.state == ST_OPEN || this.state == ST_REVEALED)
      return 'X';
    return super.toString();
  };
  isMine() {
    return true;
  }
  setField(field) {
    return new Mine(
        {
          state: this.state,
          field: field,
          x: this.x,
          y: this.y,
          board: this.board,
        }
    );
  }
  copy() {
    return new Mine(this.createRepresentation(this.state));
  }
  mark() {
    if (this.state == ST_CLOSED) {
      return new Mine(this.createRepresentation(ST_MARKED));
    } else if (this.state == ST_MARKED) {
      return new Mine(this.createRepresentation(ST_CLOSED));
    }
    return false;
  };
  open() {
    if (this.state != ST_CLOSED)
      return false;
    return new Mine(this.createRepresentation(ST_OPEN));
  };
  reveal() {
    if (this.state == ST_REVEALED || this.state == ST_OPEN)
      return false;
    return new Mine(this.createRepresentation(ST_REVEALED));
  }
}
class Clue extends Tile {
  constructor(tile) {
    super(tile);
    this.value = tile ? tile.value : 0;
  };
  getValue() {
    return this.value;
  }
  createRepresentation(st) {
    return {
      state: st,
      field: this.field,
      value: this.value,
      x: this.x,
      y: this.y,
      board: this.board,
    };
  }
  setField(field) {
    return new Clue(
        {
          state: this.state,
          field: field,
          value: this.value,
          x: this.x,
          y: this.y,
          board: this.board}
    );
  }
  copy() {
    return new Clue(this.createRepresentation(this.state));
  }
  mark() {
    if (this.state == ST_CLOSED) {
      return new Clue(this.createRepresentation(ST_MARKED));
    } else if (this.state == ST_MARKED) {
      return new Clue(this.createRepresentation(ST_CLOSED));
    }
    return false;
  };
  open() {
    if (this.state != ST_CLOSED)
      return false;
    return new Clue(this.createRepresentation(ST_OPEN));
  };
  toString() {
    if (this.state == ST_OPEN && this.value)
      return this.value;
    return super.toString();
  };
};

const game = new Game();

function updateRemaingMines() {
  document.getElementById('labRemM').innerHTML = game.getMarkedMines();
}

function checkWinLos(x, y) {
  if (game.getStatus() != G_IN_PROGRESS)
    return;
  const size = game.getBoard().getSize();
  if (x < 0 || x > size.x - 1 ||
    y < 0 || y > size.y - 1)
    return;

  if (game.getBoard().getTile(x, y).isMine())
    game.setStatus(G_LOST);
  else if (!game.getToOpen())
    game.setStatus(G_WON);

  if (game.getStatus() == G_LOST) {
    console.log('%cYOU LOST :(', 'color: red');
    stopTimer();
    revealMines();
  }
  if (game.getStatus() == G_WON) {
    console.log('%cYOU WON :)', 'color: green');
    stopTimer();
    revealMines();
  }
}

function initHtml() {
  const parent = document.getElementById('board');
  const board = game.getBoard();
  const size = board.getSize();
  parent.innerHTML = '';
  const xArr = new Array(size.x).fill(0).map((val, ind) => ind);
  const yArr = new Array(size.y).fill(0).map((val, ind) => ind);
  xArr.forEach((x) => {
    yArr.forEach((y) => {
      const button = document.createElement('button');
      button.innerHTML = board.getTile(x, y).toString();
      button.addEventListener('contextmenu', (ev)=> {
        ev.preventDefault();
        markE(x, y);
        button.innerHTML = board.getTile(x, y).toString();
      });
      button.addEventListener('click', (ev) => {
        ev.preventDefault();
        if (openE(x, y))
          checkWinLos(x, y);
        const tile = board.getTile(x, y);
        if (tile.isMine() &&
          tile.getState() == ST_OPEN) {
          button.classList.add('exploded');
        }
        button.innerHTML = tile.toString();
      });
      const tile = board.getTile(x, y);
      board.setTile(x, y, tile.setField(button));
      parent.appendChild(button);
    });
    parent.appendChild(document.createElement('br'));
  });

  updateRemaingMines();
}

function addC(x, y) {
  const size = game.getBoard().getSize();
  if (x < 0 || x > size.x - 1 ||
        y < 0 || y > size.y -1) {
    return false;
  }
  const tile = game.getBoard().getTile(x, y);
  return tile && tile.isMine();
}

function addClue(tile) {
  if (tile.isMine())
    return;
  const board = tile.board;
  const x = tile.x;
  const y = tile.y;
  let m = 0;
  if (addC(x+1, y)) m++;
  if (addC(x-1, y)) m++;
  if (addC(x+1, y+1)) m++;
  if (addC(x-1, y+1)) m++;
  if (addC(x+1, y-1)) m++;
  if (addC(x-1, y-1)) m++;
  if (addC(x, y+1)) m++;
  if (addC(x, y-1)) m++;
  board.setTile(
      x,
      y,
      new Clue({
        state: ST_CLOSED,
        value: m,
        x: x,
        y: y,
        board: board}
      )
  );
}

function init() {
  game.setStatus(G_IN_PROGRESS);
  // clear board first
  const xSize = 10;
  const ySize = 10;
  game.setBoard(xSize, ySize,
      Math.ceil(
          (xSize + ySize) / 2
      )
  );

  const board = game.getBoard();
  const mineCount = board.getMineCount();
  game.setToOpen(0);
  game.setMarkedMines(mineCount);
  let mn = mineCount;
  const size = board.getSize();
  while (mn) {
    const x = Math.floor((Math.random() * size.x));
    const y = Math.floor((Math.random() * size.y));
    const tile = board.getTile(x, y);
    if (!tile || !tile.isMine()) {
      board.setTile(
          x,
          y,
          new Mine({
            state: ST_CLOSED,
            x: x,
            y: y,
            board: board}
          )
      );
      mn--;
    }
  }

  board.getData().reduce((data, second) => data.concat(second)).map(addClue);

  const toOpen = board.getData().reduce(
      (data, second) => data.concat(second)).filter(
      (tile) => !tile.isMine()).length;
  game.setToOpen(toOpen);
  initHtml();
  startTimer();
}

function timeTick() {
  game.setTime(game.getTime() + 1);
  document.getElementById('labTime').innerHTML = game.getTime();
}

function startTimer() {
  game.setTime(0);
  if (game.getTimer())
    clearInterval(game.getTimer());
  const id = setInterval(() => {
    timeTick();
  }, 1000);
  game.setTimer(id);
  document.getElementById('labTime').innerHTML = game.getTime();
}

function stopTimer() {
  clearInterval(game.getTimer());
  game.setTimer(undefined);
  document.getElementById('labTime').innerHTML = game.getTime();
}

window.onload = () => {
  init();
  startTimer();
  document.getElementById('btnNewGame').addEventListener('click', () => {
    init();
  });
};

function recursiveOpen(x, y) {
  const board = game.getBoard();
  const size = board.getSize();
  if (
    x < 0 || x > size.x - 1 ||
        y < 0 || y > size.y -1) {
    return;
  }
  const tile = board.getTile(x, y);
  if (tile.getState() == ST_OPEN ||
        tile.isMine())
    return;

  const opened = board.getTile(x, y).open();
  if (!opened)
    return;

  game.setToOpen(game.getToOpen() - 1);
  const field = opened.getField();
  field.classList.add('opened');
  field.innerHTML = opened.toString();
  board.setTile(x, y, opened);

  if (board.getTile(x, y).getValue() === 0) {
    const f = [[1, 0], [-1, 0], [1, 1], [-1, 1],
      [1, -1], [-1, -1], [0, 1], [0, -1]];
    recursiveOpen(x + f[0][0], y + f[0][1]);
    recursiveOpen(x + f[1][0], y + f[1][1]);
    recursiveOpen(x + f[2][0], y + f[2][1]);
    recursiveOpen(x + f[3][0], y + f[3][1]);
    recursiveOpen(x + f[4][0], y + f[4][1]);
    recursiveOpen(x + f[5][0], y + f[5][1]);
    recursiveOpen(x + f[6][0], y + f[6][1]);
    recursiveOpen(x + f[7][0], y + f[7][1]);
  }
}

function revealMine(tile) {
  const revealed = tile.reveal();
  if (revealed) {
    const x = revealed.x;
    const y = revealed.y;
    revealed.board.setTile(x, y, revealed);
    revealed.getField().innerHTML = revealed.toString();
  }
}

function revealMines() {
  const board = game.getBoard();
  board.getData().reduce(
      (data, second) => data.concat(second)
  ).map(revealMine);
}

function openE(x, y) { // eslint-disable-line no-unused-vars
  if (game.getStatus() != G_IN_PROGRESS)
    return false;

  const board = game.getBoard();
  const size = board.getSize();
  if (x < 0 || x > size.x - 1 ||
    y < 0 || y > size.y - 1)
    return false;

  const opened = board.getTile(x, y).open();
  if (!opened)
    return false;

  board.setTile(x, y, opened);
  const tile = board.getTile(x, y);
  if (tile.isMine())
    return true;
  game.setToOpen(game.getToOpen() - 1);
  tile.getField().classList.add('opened');
  if (tile.getValue() === 0) {
    const f = [[1, 0], [-1, 0], [1, 1], [-1, 1],
      [1, -1], [-1, -1], [0, 1], [0, -1]];
    recursiveOpen(x + f[0][0], y + f[0][1]);
    recursiveOpen(x + f[1][0], y + f[1][1]);
    recursiveOpen(x + f[2][0], y + f[2][1]);
    recursiveOpen(x + f[3][0], y + f[3][1]);
    recursiveOpen(x + f[4][0], y + f[4][1]);
    recursiveOpen(x + f[5][0], y + f[5][1]);
    recursiveOpen(x + f[6][0], y + f[6][1]);
    recursiveOpen(x + f[7][0], y + f[7][1]);
  }
  return true;
}

function markE(x, y) {
  if (game.getStatus() != G_IN_PROGRESS)
    return;
  const size = game.getBoard().getSize();
  if (x < 0 || x > size.x - 1 ||
    y < 0 || y > size.y - 1)
    return;
  const board = game.getBoard();
  const marked = board.getTile(x, y).mark();
  if (!marked)
    return;
  board.setTile(x, y, marked);
  const markedMines = game.getMarkedMines();
  if (board.getTile(x, y).getState() == ST_MARKED)
    game.setMarkedMines(markedMines - 1);
  else
    game.setMarkedMines(markedMines + 1);
  updateRemaingMines();
}
