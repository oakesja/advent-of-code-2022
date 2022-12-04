const fs = require("fs")
const path = require("path")
const _ = require("lodash")

const file = path.resolve(__dirname, "./part-1-real-input.txt")
const data = fs.readFileSync(file).toString().split("\n")

/*
A rock 
B paper 
C scissors

X lose
Y draw 
Z win

rock 1 
paper 2 
scissors 3

lose 0 
draw 3 
win 6
*/

const rock = 1
const paper = 2
const scissors = 3

const scoreMappings = {
  "A X": scissors + 0,
  "A Y": rock + 3,
  "A Z": paper + 6,
  "B X": rock + 0,
  "B Y": paper + 3,
  "B Z": scissors + 6,
  "C X": paper + 0,
  "C Y": scissors + 3,
  "C Z": rock + 6,
}

const score = _(data).map(row => scoreMappings[row]).sum()

console.log(score)