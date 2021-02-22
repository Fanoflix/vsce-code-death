const fs = require("fs");

var lineReader = require("readline").createInterface({
  input: require("fs").createReadStream("index.html"),
});

let i = 1;
let residualLine = 0;
let residualLineLength = 1;
let residue = "";
let residualTest = false;

lineReader.on("line", function (line) {
  if (!residualTest && /</g.test(line) && !/>/g.test(line)) {
    residue = residue + line;
    residualTest = true;
    residualLine = i;
  } else if (residualTest && !/>/g.test(line)) {
    residualLineLength += 1;
    residue = residue + line;
  } else if (residualTest && />/g.test(line)) {
    residualLineLength += 1;
    residue = residue + line.match(/>/);
    residualTest = false;
  }
  i++;
});

lineReader.on("close", () => {
  console.log(residue);
  console.log(residualLine);
  console.log(residualLineLength);
 
});
