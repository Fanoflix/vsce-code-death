const fs = require('fs');

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('index.html'),
});

let i = 1;
let residualLine = 0;
let residualLineLength = 1;
let residue = '';
let residualTest = false;

lineReader.on('line', function (line) {
  if (!residualTest && /</g.test(line) && !/>/g.test(line)) {
    residue = residue + line;
    residualTest = true;
    residualLine = i;
  } else if (residualTest && !/>/g.test(line)) {
    residualLineLength += 1;
    residue = residue + ' ' + line.trim();
  } else if (residualTest && />/g.test(line)) {
    residualLineLength += 1;
    residue = residue + ' ' + line.trim();
    residualTest = false;
  }
  i++;
});

lineReader.on('close', () => {
  console.log(residue);
  console.log(residualLine);
  console.log(residualLineLength);
  fs.readFile('index.html', (err, buffer) => {
    const data = buffer.toString();
    const dataLines = data.split('\n');
    for (
      let i = residualLine - 1;
      i < residualLine - 1 + residualLineLength;
      i++
    ) {
      dataLines[i] = '';
    }
    dataLines[residualLine - 1] = residue + '\n';
    const concatData = dataLines.join('');
    fs.writeFile('test_reshape_2.html', concatData, () => {});
  });
});
