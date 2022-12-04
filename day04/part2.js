const fs = require("fs")
const path = require("path")
const _ = require("lodash")

const file = path.resolve(__dirname, "./real-input.txt")
const data = fs.readFileSync(file).toString().split("\n")

function buildRange(input) {
  const [start, end] = input.split("-")
  return _.range(parseInt(start), parseInt(end) + 1)
}

function findOverlap(input) {
  const [rawRange1, rawRange2] = input.split(",")
  const range1 = buildRange(rawRange1)
  const range2 = buildRange(rawRange2)
  return _.intersection(range1, range2).length > 0
}

const output = data.filter(findOverlap).length

console.log(output)
