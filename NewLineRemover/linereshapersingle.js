const fs = require('fs');

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('index.html'),
});

let i = 1;
let residueArray = [];
let residue = {
  residueText: '',
  residualLine: 0,
  residualLineLength: 1,
};
let residualTest = false;

lineReader.on('line', function (line) {
  if (!residualTest && /</g.test(line) && !/>/g.test(line)) {
    residue['residueText'] += line;
    residue['residualLine'] = i;
    residualTest = true;
  } else if (residualTest && !/>/g.test(line)) {
    residue['residualLineLength'] += 1;
    residue['residueText'] += ' ' + line.trim();
  } else if (residualTest && />/g.test(line)) {
    residue['residualLineLength'] += 1;
    residue['residueText'] += ' ' + line.trim();
    residualTest = false;
    residueArray.push(residue);
    residue = {
      residueText: '',
      residualLine: 0,
      residualLineLength: 1,
    };
  }
  i++;
});

lineReader.on('close', () => {
  fs.readFile('index.html', (_, buffer) => {
    const data = buffer.toString();
    const dataLines = data.split('\n');
    for (let residue of residueArray) {
      console.log(residue.residueText);
      console.log(residue.residualLine);
      console.log(residue.residualLineLength);
      for (
        let i = residue.residualLine - 1;
        i < residue.residualLine - 1 + residue.residualLineLength;
        i++
      ) {
        dataLines[i] = '';
      }
      dataLines[residue.residualLine] = residue.residueText + '\n';
    }
    const concatData = dataLines.join('');
    fs.writeFile('test_reshape_2.html', concatData, () => {});
  });
});
