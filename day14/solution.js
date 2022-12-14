const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, `./real-input.txt`);
const data = fs.readFileSync(file).toString().split("\n");

const sandStart = [500, 0];

const rockFormations = data.flatMap(row => {
  const locations = row.split(" -> ").map(l => l.split(",").map(v => parseInt(v)));
  let i = 0;
  const formations = [];
  while (i < locations.length - 1) {
    const start = locations[i];
    const finish = locations[i + 1];
    formations.push(start);

    if (start[0] !== finish[0]) {
      _.range(finish[0] - start[0], 0)
        .slice(1)
        .forEach(r => {
          formations.push([start[0] + r, start[1]]);
        });
    }

    if (start[1] !== finish[1]) {
      _.range(finish[1] - start[1], 0)
        .slice(1)
        .forEach(r => {
          formations.push([start[0], start[1] + r]);
        });
    }

    formations.push(finish);
    i += 1;
  }
  return formations;
});

function isObstructionAt(point, obstructions) {
  return !!obstructions[JSON.stringify(point)];
}

function simulateSand(obstructions, maxY) {
  let location = sandStart;
  if (isObstructionAt(location, obstructions)) {
    return undefined;
  }
  while (true) {
    const [x, y] = location;
    if (y >= maxY) {
      return undefined;
    }
    const down = [x, y + 1];
    const downLeft = [x - 1, y + 1];
    const downRight = [x + 1, y + 1];
    if (!isObstructionAt(down, obstructions)) {
      location = down;
    } else if (!isObstructionAt(downLeft, obstructions)) {
      location = downLeft;
    } else if (!isObstructionAt(downRight, obstructions)) {
      location = downRight;
    } else {
      return location;
    }
  }
}

function findSettleSandCount(obstructionList) {
  let settledSandCount = 0;
  const obstructionMap = obstructionList.reduce((accl, l) => {
    return { ...accl, [JSON.stringify(l)]: true };
  }, {});
  const maxY = _(obstructionList)
    .map(f => f[1])
    .max();

  while (true) {
    const settledSand = simulateSand(obstructionMap, maxY);
    if (!settledSand) {
      break;
    }
    obstructionMap[JSON.stringify(settledSand)] = true;
    settledSandCount += 1;
  }
  return settledSandCount;
}

const answer1 = findSettleSandCount(rockFormations);
console.log(answer1);

const xs = _(rockFormations).map(r => r[0]);
const maxX = xs.max();
const minX = xs.min();
const xRange = (maxX - minX) * 4;
const maxY = _(rockFormations)
  .map(f => f[1])
  .max();
const floor = _.range(minX - xRange, maxX + xRange).map(x => [x, maxY + 2]);

const answer2 = findSettleSandCount([...rockFormations, ...floor]);
console.log(answer2);
