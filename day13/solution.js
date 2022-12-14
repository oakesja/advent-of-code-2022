const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, `./real-input.txt`);
const data = fs.readFileSync(file).toString().split("\n");

function comparePackets(a, b) {
  // console.log(`Compare ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  if (typeof a === "number" && typeof b === "number") {
    if (a === b) {
      return undefined;
    }
    return a < b;
  }
  if (typeof a === "undefined") {
    return true;
  }
  if (typeof b === "undefined") {
    return false;
  }
  if (typeof a === "number" && typeof b !== "number") {
    return comparePackets([a], b);
  }
  if (typeof a !== "number" && typeof b === "number") {
    return comparePackets(a, [b]);
  }

  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    const comparison = comparePackets(a[i], b[i]);
    if (typeof comparison !== "undefined") {
      return comparison;
    }
  }
}

const packets = _(data)
  .filter(row => row !== "")
  .map(row => JSON.parse(row));

const answer1 = packets
  .chunk(2)
  .map(([a, b], i) => (comparePackets(a, b) ? i + 1 : 0))
  .sum();

console.log(answer1);

const dividerOne = [[2]];
const dividerTwo = [[6]];

const sorted = packets
  .push(dividerOne, dividerTwo)
  .sort((a, b) => (comparePackets(a, b) ? -1 : 1))
  .toArray();

console.log((sorted.indexOf(dividerOne) + 1) * (sorted.indexOf(dividerTwo) + 1));
