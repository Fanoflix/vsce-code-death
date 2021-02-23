const fs = require("fs");
const lineReshaper = require("./lineReshaper.js");

var classReader;
var lineReader;

lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("index.html"),
});

let i = 0;
let index = 1;
let lines = 1;
let classes = [];
let array = [];
let lastClass;
let openingTag;
let closingTag;
let classOrId;

const openingTags = /<[^/|^!][^>]*[^\/]>/gi;
const closingTags = /<\/[^>]*>*/gi;
const findClass = /(class|id)(=)("|')[^("|')]+("|')/gi;

// Run lineReshaper to move multi line classes in the same line and move it in a text file.
lineReshaper()
  .then(() => {
    classReader = require("readline").createInterface({
      input: require("fs").createReadStream("classes.html"),
    });

    // Reading single tag (classes.html) file
    return new Promise(function (resolve, _) {
      classReader.on("line", function (line) {
        classes.push(line.match(findClass));
      });
      classReader.on("close", () => {
        resolve(classes);
      });
    });
  })
  .then((classes) => {
    classes = classes.filter(id => id != null);
    for (id of classes) {
      fs.appendFile('classDump.txt', id + '\n', () => {});
    }
    
    // Reading source HTML file
    readSourceFile(classes);
  })
  .catch((err) => {
    console.log(err);
  });

function readSourceFile(classes) {
  // Reading source HTML file
  lineReader.on("line", function (line) {
  

    // let obj = {
    //   openingTag: line.match(openingTags),
    //   closingTag: line.match(closingTags),
    //   lineNumber: lines,
    //   class: ,
    //   // index,
    // };
    lastClass = classOrId;

    openingTag = line.match(openingTags);
    closingTag = line.match(closingTags);
    classOrId = line.match(findClass);
    
    // if array[array.length] == closingTag && array[array.length-1] == opening
    // if (array.length > 2 && (array[array.length-1][1] == '/' && array[array.length-2][1] !== '/' )) {
    //   i++;

    // } else 
    if (openingTag && !closingTag){
      array.push();
      if (classOrId) {
        i++;
      }
    } else if (!openingTag && closingTag) {
      if (lastClass != null) {
        // comment with classes[i];
      }
      array.pop();
    } else if (!openingTag && !closingTag) {
      // do nothing
    }
    // if both openingtag and closingtag is truthy, comment the shit out
    else if (openingTag && closingTag) {
      //write comment wth classOrId
      if (classOrId) {
      }

    } 

    // function writeToFile (linenumber, data)


    // Incrementing the classes iterator
  });
}

// lineReader.on("close", () => {
//   console.log("Done");
//   for (item of array) {
//     // console.log(
//     //   "Line #: " + item.lineNumber + " Tag:  " + item.openingTag + ' ' + item.closingTag + " Com at LN: --> " + item.lineNumber
//     // );
//   }
// });
