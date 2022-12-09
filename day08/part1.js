const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, "./real-input.txt");
const data = fs.readFileSync(file).toString().split("\n");

const treeGrid = data.reduce((accl, row) => {
  const parsedRow = row.split("").map(c => parseInt(c));
  return [...accl, parsedRow];
}, []);

const paddedRow = _.map(Array(treeGrid[0].length + 2), () => -1);
const paddedTreeGrid = [paddedRow, ...treeGrid.map(row => [-1, ...row, -1]), paddedRow];

let visibleTrees = [];

paddedTreeGrid.forEach((row, y) => {
  let tallestHeightFromLeft = row[0];
  row.forEach((treeHeight, x) => {
    if (treeHeight > tallestHeightFromLeft) {
      visibleTrees.push(`x=${x - 1} y=${y - 1} height=${treeHeight}`);
      tallestHeightFromLeft = treeHeight;
    }
  });

  const reversed = [...row].reverse();
  let tallestHeightFromRight = reversed[0];
  reversed.forEach((treeHeight, x) => {
    if (treeHeight > tallestHeightFromRight) {
      visibleTrees.push(`x=${reversed.length - x - 2} y=${y - 1} height=${treeHeight}`);
      tallestHeightFromRight = treeHeight;
    }
  });
});

const transposed = _.unzip(paddedTreeGrid);
transposed.forEach((row, x) => {
  let tallestHeightFromLeft = row[0];
  row.forEach((treeHeight, y) => {
    if (treeHeight > tallestHeightFromLeft) {
      visibleTrees.push(`x=${x - 1} y=${y - 1} height=${treeHeight}`);
      tallestHeightFromLeft = treeHeight;
    }
  });

  const reversed = [...row].reverse();
  let tallestHeightFromRight = reversed[0];
  reversed.forEach((treeHeight, y) => {
    if (treeHeight > tallestHeightFromRight) {
      visibleTrees.push(`x=${x - 1} y=${reversed.length - y - 2} height=${treeHeight}`);
      tallestHeightFromRight = treeHeight;
    }
  });
});

console.log(_.uniq(visibleTrees).length);
