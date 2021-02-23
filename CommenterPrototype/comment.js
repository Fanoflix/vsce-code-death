const fs = require('fs');

const extractClassId = (foundClass) => {
  return foundClass.map((classOrId) => {
    let result = [];
    let keyvalue = classOrId.split('=');
    if (keyvalue[0] == 'id') {
      return '#'.concat(keyvalue[1].replace(/\"|\'/g, ''));
    } else if (keyvalue[0] == 'class') {
      let classes = keyvalue[1].split(' ');
      for (let clas of classes) {
        result.push('.'.concat(clas.replace(/\"|\'/g, '')));
      }
      return result;
    }
  });
};

const commentAndSave = (data, tags, index) => {
  let comment = `<!--${tags.toString()}-->\n ${index.toString()}`;
  console.log(comment);
  comment = comment.split(' ');
  data[comment[1]] = data[comment[1]].replace('\r', '');
  data[comment[1]] += comment[0].split(',').join(' ');
  fs.writeFile('./commentTest.html', data.join(''), () => {});
};

fs.readFile('index.html', (err, buffer) => {
  if (err) {
    console.log(err);
    return;
  }
  // Class Regexes
  let openingTagRegex = /<[^/][^>]+>/g;
  let closingTagRegex = /<[/][^>]+>/g;
  let classCompleteRegex = /(?<=<[^/]*)(class|id)(=)("|')[^("|')]+("|')/g;
  let classPartialRegex = /(class|id)(=)("|')[^("|')]+("|')/g;
  let tags = [];
  let openingTag = '';
  let closingTag = '';
  let closingTagLine = 0;
  //   Main Algo
  let data = buffer.toString();
  data = data.split('\n');
  for (let index = 0; index < data.length; index++) {
    //   console.log(data[index])
    openingTag = data[index].match(openingTagRegex);
    closingTag = data[index].match(closingTagRegex);
    if (openingTag && closingTag) {
      const foundClass = data[index].match(classCompleteRegex);
      if (foundClass) {
        tags = extractClassId(foundClass);
      }
      closingTagLine = index;
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
    }
    if (tags && tags.length > 0) {
      commentAndSave(data, tags, closingTagLine);
    }
    tags = [];
  }
});
