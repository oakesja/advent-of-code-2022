const _ = require("lodash");
const fs = require("fs");
const path = require("path");

let jetPattern;
let repeatedPattern;
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

function readFile(input) {
  const file = path.resolve(__dirname, input);
  return fs.readFileSync(file).toString().trim();
}

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
  currentTop = 0;
  jetPosition = 0;

  _.times(2022, i => {
    const rock = rocks[i % rocks.length];
    simulateRock(_.cloneDeep(rock));
  });

  console.log(currentState.length - currentTop);
}

function part2(patternCheck) {
  currentState = [];
  currentTop = 0;
  jetPosition = 0;
  let i = 0;
  const patternLocations = [];
  const heightLookup = {};
  let heightAtFirstPattern;

  while (patternLocations.length < 2) {
    if (
      patternCheck(
        currentState
          .slice(3)
          .map(r => `|${r.join("")}|`)
          .join("")
      )
    ) {
      if (!heightAtFirstPattern) {
        heightAtFirstPattern = currentState.length - currentTop;
      }
      patternLocations.push(i);
    }
    if (patternLocations.length > 0) {
      heightLookup[i - patternLocations[0]] =
        currentState.length - currentTop - heightAtFirstPattern;
    }
    const rock = rocks[i % rocks.length];
    simulateRock(_.cloneDeep(rock));
    i += 1;
  }
  console.log(patternLocations);

  const patternCycle = patternLocations[1] - patternLocations[0];
  const numberOfCyles = Math.floor((1000000000000 - patternLocations[0]) / patternCycle);
  const lastCycleLength = (1000000000000 - patternLocations[0]) % patternCycle;

  const answer =
    heightLookup[lastCycleLength] +
    heightAtFirstPattern +
    heightLookup[patternCycle] * numberOfCyles;
  console.log(answer);
}

// jetPattern = readFile("./test-input.txt");
// repeatedPattern = readFile("./repeated-test-pattern.txt").replaceAll(/\s/g, "").trim();
// const patternCheck = state => state.startsWith(repeatedPattern);

jetPattern = readFile("./real-input.txt");
repeatedPattern = readFile("./repeated-real-pattern.txt").replaceAll(/\s/g, "").trim();
let patternCounts = [];
const patternCheck = state => {
  const count = state.split(repeatedPattern).length - 1;
  if (count < 1) {
    return false;
  }
  if (patternCounts.includes(count)) {
    return false;
  }
  patternCounts.push(count);
  return true;
};

part1();
part2(patternCheck);
