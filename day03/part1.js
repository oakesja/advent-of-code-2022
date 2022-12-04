const fs = require("fs")
const path = require("path")
const _ = require("lodash")

const file = path.resolve(__dirname, "./real-input.txt")
const data = fs.readFileSync(file).toString().split("\n")

const upperCaseAlpha = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const lowerCaseAlpha = upperCaseAlpha.map(c => c.toLowerCase()) 
const priorityOrder = [...lowerCaseAlpha, ...upperCaseAlpha]

function findDupe(input) {
  const compartment1 = input.slice(0, input.length / 2)
  const compartment2 = input.slice(input.length / 2, input.length)
  const dupes = _.intersection(compartment1.split(""), compartment2.split(""))
  return dupes[0]
}

function getPriority(type) {
  return priorityOrder.indexOf(type) + 1
}

const output = _(data).map(findDupe).map(getPriority).sum()

console.log(output)
