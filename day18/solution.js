const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, `./test-input.txt`);
const data = fs.readFileSync(file).toString().split("\n");

function parsePoint(input) {
  return input.split(",").map(p => parseInt(p));
}

const pointLookup = data.reduce((lookup, p) => {
  lookup[p] = true;
  return lookup;
}, {});

const points = data.map(parsePoint);

function part1() {
  function surfaceArea(point) {
    const [x, y, z] = point;
    const neighbors = [
      [x - 1, y, z],
      [x + 1, y, z],
      [x, y - 1, z],
      [x, y + 1, z],
      [x, y, z - 1],
      [x, y, z + 1]
    ];

    const neighborCount = neighbors.filter(n => pointLookup[n.join(",")]).length;
    return neighbors.length - neighborCount;
  }

  const sa = _(points).map(surfaceArea).sum();
  console.log(sa);
}

part1();
