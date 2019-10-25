const checkWin = require("../js/gamechecker");

test("Test empty array", () => {
    let arr = [[]];
    expect(checkWin(arr)).toBe("IN PROGRESS");
});

test("Test non empty array not ended game", () =>{
    let arr = [
        ["X", "", ""],
        ["", "O", ""],
        ["O", "X", ""]
    ];
    expect(checkWin(arr)).toBe("IN PROGRESS");
});

test.each([
    {
        "board": [["X", "X", "X"],
                  ["", "", "O"],
                  ["O", "", ""]]
    },
    {
        "board": [["", "", "O"],
                  ["X", "X", "X"],
                  ["O", "", ""]]
    },
    {
        "board": [["", "", "O"],
                  ["O", "", ""],
                  ["X", "X", "X"]]
    }
    ]
) (
    "Test win in line X",
    (input) => {
        expect(checkWin(input.board)).toBe("WIN. Player X Wins!");
    }
);


test.each([
    {
        "board": [["O", "O", "O"],
                  ["", "", "X"],
                  ["x", "", ""]]
    },
    {
        "board": [["", "", "X"],
                  ["O", "O", "O"],
                  ["X", "", ""]]
    },
    {
        "board": [["", "", "X"],
                  ["X", "", ""],
                  ["O", "O", "O"]]
    }
    ]
) (
    "Test win in line O",
    (input) => {
        expect(checkWin(input.board)).toBe("WIN. Player O Wins!");
    }
);
test.each([
    {
        "board": [["X", "O", "O"],
                  ["X", "", "O"],
                  ["X", "", ""]]
    },
    {
        "board": [["O", "X", "O"],
                  ["", "X", "O"],
                  ["", "X", ""]]
    },
    {
        "board": [["", "O", "X"],
                  ["", "O", "X"],
                  ["O", "", "X"]]
    }
    ]
) (
    "Test win in column X",
    (input) => {
        expect(checkWin(input.board)).toBe("WIN. Player X Wins!");
    }
);


test("Test win in column O", () =>{
    let arr = [
        ["", "X", "O"],
        ["", "X", "O"],
        ["X", "", "O"]
    ];
    expect(checkWin(arr)).toBe("WIN. Player O Wins!");
});

test("Test win in diagonal X", () =>{
    let arr = [
        ["X", "O", "O"],
        ["", "X", "O"],
        ["", "", "X"]
    ];
    expect(checkWin(arr)).toBe("WIN. Player X Wins!");
});

test("Test win in diagonal O", () =>{
    let arr = [
        ["O", "X", "X"],
        ["", "O", "X"],
        ["", "", "O"]
    ];
    expect(checkWin(arr)).toBe("WIN. Player O Wins!");
});

test("Test win in diagonal left O", () =>{
    let arr = [
        ["X", "X", "O"],
        ["", "O", "X"],
        ["O", "", ""]
    ];
    expect(checkWin(arr)).toBe("WIN. Player O Wins!");
});

test("Test draw", () =>{
    let arr = [
        ["O", "X", "O"],
        ["O", "X", "X"],
        ["X", "O", "O"]
    ];
    expect(checkWin(arr)).toBe("DRAW");
});