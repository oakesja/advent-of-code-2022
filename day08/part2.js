const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, "./real-input.txt");
const data = fs.readFileSync(file).toString().split("\n");

const treeGrid = data.reduce((accl, row) => {
  const parsedRow = row.split("").map(c => parseInt(c));
  return [...accl, parsedRow];
}, []);

const transposed = _.unzip(treeGrid);

function findScore(currentHeight, heights) {
  let score = 0;
  for (const otherHeight of heights) {
    score += 1;
    if (otherHeight >= currentHeight) {
      return score;
    }
  }
  return score;
}

function leftScore(x, y) {
  const height = treeGrid[y][x];
  const toLeft = treeGrid[y].slice(0, x).reverse();
  return findScore(height, toLeft);
}

function rightScore(x, y) {
  const height = treeGrid[y][x];
  const toRight = treeGrid[y].slice(x + 1);
  return findScore(height, toRight);
}

function belowScore(x, y) {
  const height = treeGrid[y][x];
  const below = transposed[x].slice(y + 1);
  return findScore(height, below);
}

function aboveScore(x, y) {
  const height = treeGrid[y][x];
  const above = transposed[x].slice(0, y).reverse();
  return findScore(height, above);
}

function scenicScore(x, y) {
  return rightScore(x, y) * leftScore(x, y) * belowScore(x, y) * aboveScore(x, y);
}

let highScore = 0;

for (let y = 0; y < treeGrid.length; y++) {
  for (let x = 0; x < treeGrid[y].length; x++) {
    const score = scenicScore(x, y);
    if (score > highScore) {
      highScore = score;
    }
  }
}

console.log(highScore);
