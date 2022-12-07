const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const file = path.resolve(__dirname, "./real-input.txt");
const data = fs.readFileSync(file).toString().split("\n");

function getSubtree(tree, path) {
  return path.reduce((subtree, p) => subtree[p], tree);
}

function buildFileSystemFromCommands(commands) {
  let fs = {};
  const currentPath = [];
  commands.forEach(command => {
    const cdCommand = command.match(/^\$ cd (\S*)/);
    const fileInfo = command.match(/^(\d*) (\S*)/);
    const dirInfo = command.match(/^dir (\S*)/);

    if (cdCommand) {
      const dir = cdCommand[1];
      if (dir === "..") {
        currentPath.pop();
      } else {
        let subtree = getSubtree(fs, currentPath);
        subtree[dir] = {};
        currentPath.push(dir);
      }
    }

    if (fileInfo) {
      const size = parseInt(fileInfo[1]);
      const fileName = fileInfo[2];
      getSubtree(fs, currentPath)[fileName] = size;
    }

    if (dirInfo) {
      const dirName = dirInfo[1];
      getSubtree(fs, currentPath)[dirName] = {};
    }
  });
  return fs;
}

const smallDirs = [];

function examineDirSizes(fs) {
  if (typeof fs === "number") {
    return fs;
  }
  const objects = Object.values(fs);
  const sizes = objects.map(examineDirSizes);
  const total = _.sum(sizes);
  if (total < 100000) {
    smallDirs.push(total);
  }
  return total;
}

const filesystem = buildFileSystemFromCommands(data);
examineDirSizes(filesystem["/"]);
console.log(_.sum(smallDirs));
