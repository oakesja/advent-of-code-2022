const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, `./real-input.txt`);
const data = fs.readFileSync(file).toString().split("\n");

function parseSensor(row) {
  const [_, sX, sY, bX, bY] = row.match(
    /Sensor at x=(.*), y=(.*): closest beacon is at x=(.*), y=(.*)/
  );
  const points = {
    sensorX: parseInt(sX),
    sensorY: parseInt(sY),
    beaconX: parseInt(bX),
    beaconY: parseInt(bY)
  };
  const distance =
    Math.abs(points.beaconX - points.sensorX) + Math.abs(points.beaconY - points.sensorY);
  return { ...points, distance };
}

const sensors = data.map(parseSensor);

const xs = sensors.flatMap(s => [s.sensorX, s.beaconX]);
const xStart = _(xs).min();
const xEnd = _(xs).max();

function canBeRuledOutByASensor({ x, y }) {
  for (const sensor of sensors) {
    if (sensor.beaconX === x && sensor.beaconY === y) {
      return false;
    }
    const distance = Math.abs(x - sensor.sensorX) + Math.abs(y - sensor.sensorY);
    if (distance <= sensor.distance) {
      return true;
    }
  }
  return false;
}

function part1(y) {
  let ruledOutCount = 0;
  for (let x = xStart - 10000000; x < xEnd + 10000000; x++) {
    if (canBeRuledOutByASensor({ x, y })) {
      ruledOutCount += 1;
    }
  }
  console.log(ruledOutCount);
}

function part2(max) {
  const existingBeacons = sensors.map(s => `${s.beaconX},${s.beaconY}`);

  for (let x = 0; x < max + 1; x++) {
    for (let y = 0; y < max + 1; y++) {
      if (!canBeRuledOutByASensor({ x, y }) && !existingBeacons.includes(`${x},${y}`)) {
        console.log(x * 4000000 + y);
      }
    }
  }
}

// part1(120000000);
part2(4000000);
