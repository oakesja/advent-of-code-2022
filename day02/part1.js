const fs = require("fs")
const path = require("path")
const _ = require("lodash")

const file = path.resolve(__dirname, "./part-1-real-input.txt")
const data = fs.readFileSync(file).toString().split("\n")

/*
A rock 
B paper 
C scissors

X rock
Y paper 
Z scissors

rock 1 
paper 2 
scissors 3

lose 0 
draw 3 
win 6
*/

const scoreMappings = {
  "A X": 1 + 3,
  "A Y": 2 + 6,
  "A Z": 3 + 0,
  "B X": 1 + 0,
  "B Y": 2 + 3,
  "B Z": 3 + 6,
  "C X": 1 + 6,
  "C Y": 2 + 0,
  "C Z": 3 + 3,
}

const score = _(data).map(row => scoreMappings[row]).sum()

console.log(score)