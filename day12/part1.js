const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, "./test-input.txt");
const data = fs.readFileSync(file).toString().split("\n");

const startPositionSymbol = "S";
const startElevation = "a";
const endPositionSymbol = "E";
const endElevation = "z";

let startPosition;
let endPosition;

const elevations = data.map((row, y) => {
  return row.split("").map((rawElevation, x) => {
    let elevationLetter = rawElevation;
    if (rawElevation === startPositionSymbol) {
      elevationLetter = startElevation;
      startPosition = [x, y];
    }
    if (rawElevation === endPositionSymbol) {
      elevationLetter = endElevation;
      endPosition = [x, y];
    }
    return elevationLetter.charCodeAt(0) - "a".charCodeAt(0);
  });
});

function dijkstra(start, end) {
  const distances = _.map(Array(elevations.length), () =>
    _.map(Array(elevations[0].length), () => Number.POSITIVE_INFINITY)
  );

  const pointsToInspect = [{ position: start, distance: 0 }];
  distances[start[1]][start[0]] = 0;

  while (pointsToInspect.length > 0) {
    pointsToInspect.sort((p1, p2) => p1.distance - p2.distance);
    const { position } = pointsToInspect.shift();
    const [x, y] = position;

    if (x === end[0] && y === end[1]) {
      break;
    }

    const currentElevation = elevations[y][x];
    const currentDistanceTo = distances[y][x];
    [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1]
    ].forEach(([xn, yn]) => {
      const neighborElevation = elevations[yn]?.[xn];
      const alreadyVisited = distances[yn]?.[xn] < Number.POSITIVE_INFINITY;
      if (neighborElevation <= currentElevation + 1 && !alreadyVisited) {
        const distance = currentDistanceTo + 1;
        if (distance < distances[yn][xn]) {
          distances[yn][xn] = distance;
          pointsToInspect.push({ position: [xn, yn], distance });
        }
      }
    });
  }

  return distances[end[1]][end[0]];
}

const steps = dijkstra(startPosition, endPosition);
console.log(steps);
