const fs = require("fs");

var lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("index.html"),
});

let i = 1;
let index = 1;
let lines = 1;

const openingTags = /<[^/|^!][^>]*>/gi;
const closingTags = /<\/[^>]*>*/gi;
const findClass = /(class|id)(=)("|')[^("|')]+("|')/gi;
let array = [];

// WITH IF (Smaller Array)
lineReader.on("line", function (line) {
  let obj = {
    openingTag: line.match(openingTags),
    closingTag: line.match(closingTags),
    lineNumber: lines,
    class: line.match(findClass),
    // index,
  };

  // if both openingtag and closingtag is truthy, comment the shit out

  // if array[array.length] == closingTag && array[array.length-1] == opening

  array.push(obj);

  // function writeToFile (linenumber, data)

  lines++;
});

lineReader.on("close", () => {
  console.log("Done");
  for (item of array) {
    console.log(
      "Line #: " + item.lineNumber + " Tag:  " + item.openingTag + ' ' + item.closingTag + " Com at LN: --> " + item.lineNumber
    );
  }
});