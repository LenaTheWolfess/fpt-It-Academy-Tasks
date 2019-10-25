/* eslint-disable linebreak-style */

/**
 * @param {[][]} array
 * @return {string}
 */
function checkwin(array) { // eslint-disable-line no-unused-vars
  let pFound1 = 0;
  let pFound2 = 0;

  const pCh1 = 'X';
  const pCh2 = 'O';

  const wNeed = 3;

  // Check for draw first
  let someFree = false;
  let someEl = false;
  for (const line of array) {
    for (const el of line) {
      if (el == '') {
        someFree = true;
      }
      if (el == pCh2 || el == pCh1) {
        someEl = true;
      }
      if (someEl && someFree) {
        break;
      }
    }
    if (someFree && someEl) {
      break;
    }
  }

  // Check lines
  for (const line of array) {
    let winning = '';
    for (const character of line) {
      if (winning && winning == character) {
        if (character == pCh1) {
          pFound1++;
          if (pFound1 >= wNeed) {
            return 'WIN. Player X Wins!';
          }
        }
        if (character == pCh2) {
          pFound2++;
          if (pFound2 >= wNeed) {
            return 'WIN. Player O Wins!';
          }
        }
      } else if (character) {
        winning = character;
        pFound1 = character == pCh1;
        pFound2 = character == pCh2;
      }
    }
  }

  pFound1 = 0;
  pFound2 = 0;
  // Check columns
  const len = array.length;
  for (let col = 0; col < len; ++col) {
    let winning = '';
    for (let line = 0; line < len; ++line) {
      const character = array[line][col];
      if (winning && winning == character) {
        if (character == pCh1) {
          pFound1++;
          if (pFound1 >= wNeed) {
            return 'WIN. Player X Wins!';
          }
        }
        if (character == pCh2) {
          pFound2++;
          if (pFound2 >= wNeed) {
            return 'WIN. Player O Wins!';
          }
        }
      } else if (character) {
        winning = character;
        pFound1 = character == pCh1;
        pFound2 = character == pCh2;
      }
    }
  }

  // Check diagonals
  for (let line = 0; line < len; ++line) {
    // Find first letter to check
    for (let col = 0; col < len; ++col) {
      // Now check only right down and left down
      if (array[line][col]) {
        const winning = array[line][col];
        pFound2 = winning == pCh2;
        pFound1 = winning == pCh1;
        // Start right down
        let xCol = col;
        for (let xLine = line + 1; xLine < len; ++xLine) {
          xCol++;
          if (xCol >= len || array[xLine][xCol] != winning) {
            break;
          }
          if (winning == pCh1) {
            pFound1++;
            if (pFound1 >= wNeed) {
              return 'WIN. Player X Wins!';
            }
          }
          if (winning == pCh2) {
            pFound2++;
            if (pFound2 >= wNeed) {
              return 'WIN. Player O Wins!';
            }
          }
        }
        pFound2 = winning == pCh2;
        pFound1 = winning == pCh1;
        // Start right down
        xCol = col;
        for (let xLine = line + 1; xLine < len; ++xLine) {
          xCol--;
          if (xCol < 0 ||
                        xCol >= len ||
                        array[xLine][xCol] != winning
          ) {
            break;
          }
          if (winning == pCh1) {
            pFound1++;
            if (pFound1 >= wNeed) {
              return 'WIN. Player X Wins!';
            }
          }
          if (winning == pCh2) {
            pFound2++;
            if (pFound2 >= wNeed) {
              return 'WIN. Player O Wins!';
            }
          }
        }
      }
    }
  }

  if (someFree) {
    return 'IN PROGRESS';
  } else if (!someEl) {// !someFree has to be true
    return 'IN PROGRESS';
  }
  return 'DRAW';
}

module.exports = checkwin;
