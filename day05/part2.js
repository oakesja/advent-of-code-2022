const fs = require("fs")
const path = require("path")
const _ = require("lodash")

const file = path.resolve(__dirname, "./real-input.txt")
const data = fs.readFileSync(file).toString().split("\n")

const delimeterIndex = data.findIndex((row) => row === "")
const rawStart = data.slice(0, delimeterIndex)
const instructions = data.slice(delimeterIndex + 1)

function buildStartingInput(rawStart) {
  const stackInfo = rawStart.pop()
  const numStacks = parseInt(stackInfo.trim().split(" ").pop())
  const stacks = _.map(Array(numStacks), () => [])
  rawStart.forEach((row) => {
    let stackIndex = 0
    for (let i = 1; i < row.length; i = i + 4) {
      const cargo = row[i]
      if (cargo.trim()) {
        stacks[stackIndex].push(cargo)
      }
      stackIndex += 1
    } 
  })
  return stacks
}

function followMoveInstruction(stacks, instruction) {
  const match = instruction.match(/move (\d*) from (\d*) to (\d*)/)
  const numToMove = parseInt(match[1])
  const stackToMoveFrom = parseInt(match[2]) - 1
  const stackToMoveTo = parseInt(match[3]) - 1
  const toMove = _.take(stacks[stackToMoveFrom], numToMove)
  stacks[stackToMoveFrom] = stacks[stackToMoveFrom].slice(numToMove)
  stacks[stackToMoveTo] = [...toMove, ...stacks[stackToMoveTo]]
}

const stacks = buildStartingInput(rawStart)
instructions.forEach(instruction => followMoveInstruction(stacks, instruction))

console.log(stacks.map(s => s[0]).join(""))