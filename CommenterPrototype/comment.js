const fs = require('fs');

// Class Regexes
const openingTagRegex = /<[^/|^!][^>]+[^/]>/g;
const closingTagRegex = /<[/][^>]+>/g;
const classCompleteRegex = /(?<=<[^/]*)(class|id)(=)("|')[^("|')]+("|')/g;
const classPartialRegex = /(class|id)(=)("|')[^("|')]+("|')/g;
const commentRegex = /<!--(\.|#)[^>]*-->/g;
let data;

const writeToFile = () => {
  fs.writeFile('./commentTest.html', data.join('\n').trim(), () => {});
};

const replaceComment = (data, commentIndex) => {
  return data[commentIndex].replace(commentRegex, '');
};

const extractClassId = (foundClass) => {
  return foundClass.map((classOrId) => {
    let result = [];
    let keyvalue = classOrId.split('=');
    if (keyvalue[0] == 'id') {
      keyvalue[1] = keyvalue[1].replace(/\"|\'/g, '');
      if (keyvalue[1] !== '') {
        return '#'.concat(keyvalue[1]);
      } else {
        return;
      }
    } else if (keyvalue[0] == 'class') {
      let classes = keyvalue[1].split(' ');
      for (let clas of classes) {
        clas = clas.replace(/\"|\'/g, '');
        if (clas !== '') {
          result.push('.'.concat(clas));
        }
      }
      return result;
    }
  });
};

const commentAndSave = (data, tags, index) => {
  if (tags[0] === -1) {
    data[index] = replaceComment(data, index);
  } else {
    let comment = `<!--${tags.toString()}-->`;
    comment = comment.split(',').join(' ');
    if (commentRegex.test(data[index])) {
      data[index] = replaceComment(data, index);
    }
    data[index] = data[index].replace('\r', '');
    data[index] += comment;
  }
};

fs.readFile('commentTest.html', (err, buffer) => {
  if (err) {
    console.log(err);
    return;
  }

  let tags = [];
  let openingTag = '';
  let closingTag = '';
  let closingTagLine = 0;
  let classStack = [];
  //   Main Algo
  data = buffer.toString();
  data = data.split('\n');
  for (let index = 0; index < data.length; index++) {
    //   console.log(data[index])
    openingTag = data[index].match(openingTagRegex);
    closingTag = data[index].match(closingTagRegex);
    if (openingTag && closingTag) {
      // const foundClass = data[index].match(classCompleteRegex);
      // if (foundClass) {
      //   tags = extractClassId(foundClass);
      // }
      // closingTagLine = index;
      continue;
    } else if (/</g.test(data[index]) && !/>/g.test(data[index])) {
      let foundClass = [];
      closingTagLine = 0;
      while (!closingTagRegex.test(data[index + closingTagLine])) {
        if (/(class|id)="/.test(data[index + closingTagLine])) {
          foundClass.push(
            data[index + closingTagLine].match(classPartialRegex)
          );
        }
        closingTagLine += 1;
      }
      foundClass = foundClass.flat();
      if (foundClass) {
        tags = extractClassId(foundClass);
      }
      closingTagLine += index;
      index = closingTagLine;
    } else if (openingTag && !closingTag) {
      const foundClass = data[index].match(classCompleteRegex);
      if (foundClass) {
        tags = extractClassId(foundClass);
      }
      if (tags.length > 0) {
        classStack.push(tags);
      } else {
        classStack.push([-1]);
      }
      tags = [];
      continue;
    } else if (!openingTag && closingTag) {
      tags = classStack.pop();
      closingTagLine = index;
    } else {
      continue;
    }
    if (tags && tags.length > 0) {
      commentAndSave(data, tags, closingTagLine);
    }
    tags = [];
  }
  writeToFile();
});
