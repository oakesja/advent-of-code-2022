const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, "./real-input.txt");
const data = fs.readFileSync(file).toString().split("\n");

function parseMonekyId(input) {
  return parseInt(input.match(/Monkey (\d*)/)[1]);
}

function parseItemsToStart(input) {
  return input.match(/Starting items: (.*)/)[1].split(",");
}

function parseOperation(input) {
  return input.match(/Operation: new = (.*)/)[1];
}

function parseDivisibleBy(input) {
  return parseInt(input.match(/Test: divisible by (\d*)/)[1]);
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

const greatestCommonMultiple = _.reduce(
  monkeys,
  (accl, monkey) => accl * monkey.divisbleBy,
  1
);

function simulateRound() {
  monkeys.forEach(monkey => {
    _.times(monkey.items.length, () => {
      const item = monkey.items.shift();
      let newWorrayLevel =
        eval(monkey.operation.replaceAll("old", item)) % greatestCommonMultiple;
      if (newWorrayLevel % monkey.divisbleBy === 0) {
        monkeys[monkey.ifTrueThrowTo].items.push(newWorrayLevel);
      } else {
        monkeys[monkey.ifFalseThrowTo].items.push(newWorrayLevel);
      }
      monkey.inspectedItemCount += 1;
    });
  });
}

_.times(10000, simulateRound);

const [first, second] = _(monkeys)
  .sortBy(m => m.inspectedItemCount)
  .reverse()
  .slice(0, 2)
  .map(m => m.inspectedItemCount)
  .value();

console.log(first * second);
