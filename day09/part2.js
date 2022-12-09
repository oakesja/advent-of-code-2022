const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, "./real-input.txt");
const data = fs.readFileSync(file).toString().split("\n");

const motions = data.map(row => {
  const [_, direction, steps] = row.match(/(\w) (\d*)/);
  return { direction, steps };
});

const startPosition = [0, 0];
const tailPositionsVisited = [startPosition];
const positions = _.map(Array(10), () => startPosition);

function nextHeadPosition(direction, head) {
  switch (direction) {
    case "R":
      return [head[0] + 1, head[1]];
    case "L":
      return [head[0] - 1, head[1]];
    case "U":
      return [head[0], head[1] + 1];
    case "D":
      return [head[0], head[1] - 1];
    default:
      throw new Error("Unknow direction");
  }
}

function nextTailPosition(head, tail) {
  const xDist = head[0] - tail[0];
  const yDist = head[1] - tail[1];
  const distanceFromHead = Math.sqrt(xDist * xDist + yDist * yDist);
  if (Math.floor(distanceFromHead) <= 1) {
    return tail;
  }

  /*
    T..H
  */
  if (_.isEqual(head, [tail[0] + 2, tail[1]])) {
    return [tail[0] + 1, tail[1]];
  }
  /*
    ..H
    T..
  */
  if (_.isEqual(head, [tail[0] + 2, tail[1] + 1])) {
    return [tail[0] + 1, tail[1] + 1];
  }
  /*
    .H
    ..
    T.
  */
  if (_.isEqual(head, [tail[0] + 1, tail[1] + 2])) {
    return [tail[0] + 1, tail[1] + 1];
  }
  /*
    H
    .
    T
  */
  if (_.isEqual(head, [tail[0], tail[1] + 2])) {
    return [tail[0], tail[1] + 1];
  }
  /*
   H.
   ..
   .T
  */
  if (_.isEqual(head, [tail[0] - 1, tail[1] + 2])) {
    return [tail[0] - 1, tail[1] + 1];
  }
  /*
   H..
   ..T
  */
  if (_.isEqual(head, [tail[0] - 2, tail[1] + 1])) {
    return [tail[0] - 1, tail[1] + 1];
  }
  /*
   H.T
  */
  if (_.isEqual(head, [tail[0] - 2, tail[1]])) {
    return [tail[0] - 1, tail[1]];
  }
  /*
   ..T
   H..
  */
  if (_.isEqual(head, [tail[0] - 2, tail[1] - 1])) {
    return [tail[0] - 1, tail[1] - 1];
  }
  /*
   .T
   ..
   H.
  */
  if (_.isEqual(head, [tail[0] - 1, tail[1] - 2])) {
    return [tail[0] - 1, tail[1] - 1];
  }
  /*
   T
   .
   H
  */
  if (_.isEqual(head, [tail[0], tail[1] - 2])) {
    return [tail[0], tail[1] - 1];
  }
  /*
   T.
   ..
   .H
  */
  if (_.isEqual(head, [tail[0] + 1, tail[1] - 2])) {
    return [tail[0] + 1, tail[1] - 1];
  }
  /*
   T..
   ..H
  */
  if (_.isEqual(head, [tail[0] + 2, tail[1] - 1])) {
    return [tail[0] + 1, tail[1] - 1];
  }
  /*
      ..H
      T..
  */
  if (_.isEqual(head, [tail[0] + 2, tail[1] + 2])) {
    return [tail[0] + 1, tail[1] + 1];
  }
  /*
      H..
      ..T
  */
  if (_.isEqual(head, [tail[0] - 2, tail[1] + 2])) {
    return [tail[0] - 1, tail[1] + 1];
  }
  /*
      ..T
      H..
  */
  if (_.isEqual(head, [tail[0] - 2, tail[1] - 2])) {
    return [tail[0] - 1, tail[1] - 1];
  }
  /*
      T..
      ..H
  */
  if (_.isEqual(head, [tail[0] + 2, tail[1] - 2])) {
    return [tail[0] + 1, tail[1] - 1];
  }
  console.log({ head, tail, distanceFromHead });
  throw new Error("Forgot a tail movement");
}

function move({ direction, steps }) {
  for (let step = 0; step < steps; step++) {
    const head = positions[0];
    const nextHead = nextHeadPosition(direction, head);
    positions[0] = nextHead;
    for (let i = 1; i < positions.length; i++) {
      const positionToFollow = positions[i - 1];
      const tail = positions[i];
      const nextTail = nextTailPosition(positionToFollow, tail);
      positions[i] = nextTail;
      if (i === positions.length - 1) {
        tailPositionsVisited.push(nextTail);
      }
    }
  }
}

motions.forEach(move);

const uniqPositions = _(tailPositionsVisited)
  .map(p => `${p[0]},${p[1]}`)
  .uniq()
  .value();

console.log(uniqPositions.length);
