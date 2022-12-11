const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, "./test-input.txt");
const data = fs.readFileSync(file).toString().split("\n");

function parseMonekyId(input) {
  return parseInt(input.match(/Monkey (\d*)/)[1]);
}

function parseItemsToStart(input) {
  return input
    .match(/Starting items: (.*)/)[1]
    .split(",")
    .map(n => BigInt(n));
}

function parseOperation(input) {
  const operation = input.match(/Operation: new = (.*)/)[1];
  return operation.replace(/(\d+)/g, "$1n");
}

function parseDivisibleBy(input) {
  return BigInt(input.match(/Test: divisible by (\d*)/)[1]);
}

function parseThrowTo(input) {
  return parseInt(input.match(/.* (\d*)/)[1]);
}

function parseMonkeyInfo(input) {
  const [rawMonkeyId, rawStarting, rawOperation, rawTest, rawTrue, rawFalse] = input;
  return {
    id: parseMonekyId(rawMonkeyId),
    items: parseItemsToStart(rawStarting),
    operation: parseOperation(rawOperation),
    divisbleBy: parseDivisibleBy(rawTest),
    ifTrueThrowTo: parseThrowTo(rawTrue),
    ifFalseThrowTo: parseThrowTo(rawFalse),
    inspectedItemCount: 0
  };
}

const monkeys = _(data)
  .filter(row => row !== "")
  .chunk(6)
  .map(parseMonkeyInfo)
  .value();

function simulateRound() {
  monkeys.forEach(monkey => {
    _.times(monkey.items.length, () => {
      const item = monkey.items.shift();
      const newWorrayLevel = eval(monkey.operation.replaceAll("old", `${item}n`));
      if (newWorrayLevel % monkey.divisbleBy === 0) {
        monkeys[monkey.ifTrueThrowTo].items.push(newWorrayLevel);
      } else {
        monkeys[monkey.ifFalseThrowTo].items.push(newWorrayLevel);
      }
      monkey.inspectedItemCount += 1;
    });
  });
}

_.times(20, simulateRound);

console.log(monkeys.map(m => m.inspectedItemCount));

// const [first, second] = _(monkeys)
//   .sortBy(m => m.inspectedItemCount)
//   .reverse()
//   .slice(0, 2)
//   .map(m => m.inspectedItemCount)
//   .value();

// console.log(first * second);
