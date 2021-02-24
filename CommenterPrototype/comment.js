const fs = require('fs');

const openingTagRegex = /<[^/|^!][^>]+[^/]>/g;
const closingTagRegex = /<[/][^>]+>/g;
const classCompleteRegex = /(?<=<[^/]*)(class|id)(=)("|')[^("|')]+("|')/g;
const classPartialRegex = /(class|id)(=)("|')[^("|')]+("|')/g;

const extractClassId = (foundClass) => {
  return foundClass.map((classOrId) => {
    let result = [];
    let keyvalue = classOrId.split('=');
    if (keyvalue[0] == 'id') {
      return '#'.concat(keyvalue[1].replace(/\"|\'/g, ''));
    } else if (keyvalue[0] == 'class') {
      let classes = keyvalue[1].split(' ');
      for (let clas of classes) {
        if (clas !== '') {
          result.push('.'.concat(clas.replace(/\"|\'/g, '')));
        }
      }
      return result;
    }
  });
};

const commentAndSave = (data, tags, index) => {
  let comment = `<!--${tags.toString()}--> ${index.toString()}`;
  comment = comment.split(' ');
  comment[0] = comment[0].split(',').join(' ');
  let commentRegex = /<!--(\.|#)[^>]*-->/g;
  if (commentRegex.test(data[comment[1]])) {
    data[comment[1]] = data[comment[1]].replace(commentRegex, '');
  }
  data[comment[1]] = data[comment[1]].replace('\r', '');
  data[comment[1]] += comment[0];
  fs.writeFile('./commentTest.html', data.join('\n'), () => {});
};

fs.readFile('commentTest.html', (err, buffer) => {
  if (err) {
    console.log(err);
    return;
  }
  // Class Regexes

  let tags = [];
  let openingTag = '';
  let closingTag = '';
  let closingTagLine = 0;
  let classStack = [];
  //   Main Algo
  let data = buffer.toString();
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
});
