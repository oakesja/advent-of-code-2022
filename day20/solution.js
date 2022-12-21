const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, `./real-input.txt`);
const data = fs
  .readFileSync(file)
  .toString()
  .split("\n")
  .map(line => parseInt(line));

const toDecrypt = data;
const decrypted = _.cloneDeep(data);

for (const num of toDecrypt) {
  const currentPosition = decrypted.indexOf(num);
  decrypted.splice(currentPosition, 1)[0];
  let newPosition = (currentPosition + num) % decrypted.length;
  if (newPosition <= 0) {
    newPosition = decrypted.length + newPosition;
  }
  if (newPosition === decrypted.length - 1) {
    newPosition = 0;
  }
  decrypted.splice(newPosition, 0, num);
}

const zeroIndex = decrypted.indexOf(0);
const numberOfRepeats = Math.ceil((3000 + zeroIndex) / decrypted.length);
const pattern = _.flatten(_.times(numberOfRepeats, _.constant(decrypted)));

console.log(
  pattern[zeroIndex + 1000] + pattern[zeroIndex + 2000] + pattern[zeroIndex + 3000]
);

/*
2, 1, -3, 3, -2, 0, 4
1, -3, 2, 3, -2, 0, 4
1, 2, 3, -2, -3, 0, 4
1, 2, -2, -3, 0, 3, 4
1, 2, -3, 0, 3, 4, -2
1, 2, -3, 0, 3, 4, -2
1, 2, -3, 4, 0, 3, -2
*/
