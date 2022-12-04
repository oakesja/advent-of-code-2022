const fs = require("fs")
const path = require("path")
const _ = require("lodash")

const file = path.resolve(__dirname, "./part-1-real-input.txt")
const data = fs.readFileSync(file).toString()

const groups = []
let currentGroup = []
data.split("\n").forEach(e => {
  if (e.trim() === "") {
    groups.push(currentGroup)
    currentGroup = []
  } else {
    currentGroup.push(e)
  }
});
groups.push(currentGroup)

sums = groups.map(g => _.sum(g.map(c => parseInt(c))))

console.log(_.max(sums))