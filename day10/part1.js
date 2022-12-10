const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, "./real-input.txt");
const data = fs.readFileSync(file).toString().split("\n");

const instructions = data.map(input => {
  if (input === "noop") {
    return {
      cycles: 1,
      change: 0
    };
  }
  const add = input.match(/addx (\S*)/);
  return {
    cycles: 2,
    change: parseInt(add[1])
  };
});

let cycle = 1;
let currentValue = 1;
const signalStrengths = [];

instructions.forEach(instruction => {
  for (let i = 0; i < instruction.cycles; i++) {
    if (cycle % 40 === 20) {
      signalStrengths.push(cycle * currentValue);
    }
    cycle += 1;
  }
  currentValue += instruction.change;
});

console.log(_.sum(signalStrengths));
