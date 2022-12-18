const _ = require("lodash");
const fs = require("fs");
const path = require("path");

const testFile = path.resolve(__dirname, `./test-input.txt`);
const testPattern = fs.readFileSync(testFile).toString().trim();

const realFile = path.resolve(__dirname, `./real-input.txt`);
const realPattern = fs.readFileSync(realFile).toString().trim();

const jetPattern = testPattern;
const rockStartRoom = 3;
const rowWidth = 7;
const newRow = _.fill(Array(rowWidth), ".");
let currentState = [];
let currentTop = 0;
let jetPosition = 0;

const rocks = [
  [[".", ".", "@", "@", "@", "@", "."]],
  [
    [".", ".", ".", "@", ".", ".", "."],
    [".", ".", "@", "@", "@", ".", "."],
    [".", ".", ".", "@", ".", ".", "."]
  ],
  [
    [".", ".", ".", ".", "@", ".", "."],
    [".", ".", ".", ".", "@", ".", "."],
    [".", ".", "@", "@", "@", ".", "."]
  ],
  [
    [".", ".", "@", ".", ".", ".", "."],
    [".", ".", "@", ".", ".", ".", "."],
    [".", ".", "@", ".", ".", ".", "."],
    [".", ".", "@", ".", ".", ".", "."]
  ],
  [
    [".", ".", "@", "@", ".", ".", "."],
    [".", ".", "@", "@", ".", ".", "."]
  ]
];

function displayState() {
  console.log();
  currentState.forEach(r => console.log(`|${r.join("")}|`));
  console.log(`+-------+`);
  console.log();
}

function canMoveLeft(rockRows) {
  return rockRows
    .map(row => currentState[row])
    .every(row => {
      const leftMostRock = row.indexOf("@");
      return leftMostRock !== 0 && row[leftMostRock - 1] !== "#";
    });
}

function canMoveRight(rockRows) {
  return rockRows
    .map(row => currentState[row])
    .every(row => {
      const rightMostRock = row.lastIndexOf("@");
      return rightMostRock !== row.length - 1 && row[rightMostRock + 1] !== "#";
    });
}

function canMoveDown(rockRows) {
  const lastRowIndex = _(rockRows).last();
  if (lastRowIndex === currentState.length - 1) {
    return false;
  }
  return rockRows.every(rowIndex => {
    return currentState[rowIndex].every((value, i) => {
      if (value !== "@") {
        return true;
      }
      return currentState[rowIndex + 1][i] !== "#";
    });
  });
}

function moveRight(rockRows) {
  rockRows.forEach(currentRowIndex => {
    _.range(rowWidth - 1, -1).forEach(i => {
      if (currentState[currentRowIndex][i] === "@") {
        currentState[currentRowIndex][i + 1] = "@";
        currentState[currentRowIndex][i] = ".";
      }
    });
  });
}

function moveLeft(rockRows) {
  rockRows.forEach(currentRowIndex => {
    _.times(rowWidth).forEach(i => {
      if (currentState[currentRowIndex][i] === "@") {
        currentState[currentRowIndex][i - 1] = "@";
        currentState[currentRowIndex][i] = ".";
      }
    });
  });
}

function moveDown(rockRows) {
  [...rockRows].reverse().forEach(currentRowIndex => {
    const currentRow = currentState[currentRowIndex];
    currentRow.forEach((value, i) => {
      if (value === "@") {
        currentState[currentRowIndex][i] = ".";
        currentState[currentRowIndex + 1][i] = "@";
      }
    });
  });
}

function moveToResting(rockRows) {
  rockRows.forEach(currentRowIndex => {
    _.times(rowWidth).forEach(i => {
      if (currentState[currentRowIndex][i] === "@") {
        currentState[currentRowIndex][i] = "#";
      }
    });
  });
}

function simulateRock(rock) {
  const rockHeight = rock.length;
  const roomNeeded = 3 - currentTop;
  _.times(roomNeeded, () => currentState.unshift([...newRow]));
  currentState.unshift(...rock);
  let rockRows = _.range(0, rockHeight);

  while (true) {
    const jet = jetPattern.charAt(jetPosition % jetPattern.length);
    console.log(jet);
    if (jet === "<" && canMoveLeft(rockRows)) {
      moveLeft(rockRows);
    }
    if (jet === ">" && canMoveRight(rockRows)) {
      moveRight(rockRows);
    }
    jetPosition += 1;
    if (canMoveDown(rockRows)) {
      moveDown(rockRows);
      rockRows = rockRows.map(r => r + 1);
    } else {
      moveToResting(rockRows);
      break;
    }
  }

  currentTop = currentState.findIndex(value => value.indexOf("#") > -1);
  if (currentTop > rockStartRoom) {
    _(currentTop - rockStartRoom).times(() => currentState.shift());
    currentTop = rockStartRoom;
  }
}

function part1() {
  currentState = [];
  _.times(2022, i => {
    const rock = rocks[i % rocks.length];
    console.log(i % rocks.length);
    simulateRock(_.cloneDeep(rock));
  });

  displayState();
}

function part2() {
  currentState = [];
  _.times(1000000000000, i => {
    const rock = rocks[i % rocks.length];
    simulateRock(_.cloneDeep(rock));
  });

  console.log(currentState.length - currentTop);
}

part1();
