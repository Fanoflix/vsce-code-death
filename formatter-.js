const fs = require("fs");
const path = require("path");

const identifiersFilePath = path.join(__dirname, "/tests/", "identifiers.txt");
const tagsFilePath = path.join(__dirname, "/tests/", "pickedTags.txt");
const closingTagsFilePath = path.join(__dirname, "/tests/", "closingTags.txt");

// Clearing Files
fs.truncate(identifiersFilePath, 0, () => {
  console.log("Cleared identifiers.txt");
});
fs.truncate(tagsFilePath, 0, () => {
  console.log("Cleared pickedTags.txt");
});
fs.truncate(closingTagsFilePath, 0, () => {
  console.log("Cleared closingTags.txt");
});

const file = fs.readFile("index.html", (err, buffer) => {
  if (!err) {
    let sample = buffer.toString();
    const noOfLines = sample.split("\n").length;

    const tags = sample.match(/<[^!][^>]*>/gi);

    for (classes of tags) {
      // if an open tag is found opening tag push to stack
      // ... if another opening tag is found, push to stack
      // ... else if closing tag is found pop from stack
      // ...... if only stack length() == 1, and closing tag is found -- lambi logic

      let identifiers =
        classes.match(/(class|id)(=)("|')[^("|')]+("|')/gi) + "\n";

      // Writing "tags" to testing file for Debugging
      fs.appendFile(tagsFilePath, classes + "\n", () => {
        if (err) throw err;
      });

      // Writing "identifiers" to testing file for Debugging
      fs.appendFile(identifiersFilePath, identifiers, () => {
        if (err) throw err;
      });
    }

    const closingTags = sample.match(/<\/[^>]*>*/g);
    console.log(closingTags);
    for (closingTag of closingTags) {
      console.log(closingTag);

      fs.appendFile(closingTagsFilePath, closingTag + "\n", () => {
        if (err) throw err;
      });
    }
  }
});