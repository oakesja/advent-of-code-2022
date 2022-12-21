const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const algebra = require("algebra.js");

const file = path.resolve(__dirname, `./real-input.txt`);

const lookup = fs
  .readFileSync(file)
  .toString()
  .split("\n")
  .reduce((map, line) => {
    const numberMatch = line.match(/(\S*): (\d+)/);
    const additionMatch = line.match(/(\S*): (\S+) \+ (\S+)/);
    const subtractionMatch = line.match(/(\S*): (\S+) - (\S+)/);
    const multiplyMatch = line.match(/(\S*): (\S+) \* (\S+)/);
    const divideMatch = line.match(/(\S*): (\S+) \/ (\S+)/);
    if (numberMatch) {
      map[numberMatch[1]] = {
        type: "value",
        value: parseInt(numberMatch[2])
      };
    }
    if (additionMatch) {
      map[additionMatch[1]] = {
        type: "addition",
        a: additionMatch[2],
        b: additionMatch[3]
      };
    }
    if (subtractionMatch) {
      map[subtractionMatch[1]] = {
        type: "subtraction",
        a: subtractionMatch[2],
        b: subtractionMatch[3]
      };
    }
    if (multiplyMatch) {
      map[multiplyMatch[1]] = {
        type: "multiply",
        a: multiplyMatch[2],
        b: multiplyMatch[3]
      };
    }
    if (divideMatch) {
      map[divideMatch[1]] = {
        type: "divide",
        a: divideMatch[2],
        b: divideMatch[3]
      };
    }
    if (
      !(numberMatch || additionMatch || subtractionMatch || multiplyMatch || divideMatch)
    ) {
      throw new Error(`Failed to parse: ${line}`);
    }
    return map;
  }, {});

function part1() {
  function getValue(key) {
    const value = lookup[key];
    switch (value.type) {
      case "value":
        return value.value;
      case "addition":
        return getValue(value.a) + getValue(value.b);
      case "subtraction":
        return getValue(value.a) - getValue(value.b);
      case "multiply":
        return getValue(value.a) * getValue(value.b);
      case "divide":
        return getValue(value.a) / getValue(value.b);
      default:
        throw new Error(`Failed to get value for: ${key}`);
    }
  }
  console.log(getValue("root"));
}

function part2() {
  function getValue(key) {
    if (key === "humn") {
      return NaN;
    }
    const value = lookup[key];
    switch (value.type) {
      case "value":
        return value.value;
      case "addition":
        return getValue(value.a) + getValue(value.b);
      case "subtraction":
        return getValue(value.a) - getValue(value.b);
      case "multiply":
        return getValue(value.a) * getValue(value.b);
      case "divide":
        return getValue(value.a) / getValue(value.b);
      default:
        throw new Error(`Failed to get value for: ${key}`);
    }
  }

  function buildEquation(key) {
    const value = lookup[key];
    if (key === "humn") {
      return "x";
    }
    switch (value.type) {
      case "value":
        return `${value.value}`;
      case "addition":
        return `(${buildEquation(value.a)} + ${buildEquation(value.b)})`;
      case "subtraction":
        return `(${buildEquation(value.a)} - ${buildEquation(value.b)})`;
      case "multiply":
        return `(${buildEquation(value.a)} * ${buildEquation(value.b)})`;
      case "divide":
        return `(${buildEquation(value.a)} / ${buildEquation(value.b)})`;
      default:
        throw new Error(`Failed to get build solution for: ${key}`);
    }
  }

  const root = lookup["root"];
  const a = getValue(root.a);
  const b = getValue(root.b);
  const value = isNaN(a) ? b : a;
  const equation = isNaN(a) ? buildEquation(root.a) : buildEquation(root.b);
  const solution = algebra.parse(`${value} = ${equation}`).solveFor("x");
  console.log(solution);
}

// part1();
part2();
