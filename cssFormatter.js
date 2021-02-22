const fs = require("fs");

fs.readFile("index.html", (err, buffer) => {
  if (err) {
    console.log(err);
    return;
  }
  let fileText = buffer.toString();
  console.log(
    `Initial File Text ->\n ${fileText} \n---------------------------------------`
  );
  //   const classRegex = /class(=)(\"|\')[^"|']+(\"|\')/gi;
  //   const classes = fileText.match(classRegex);
  //   console.log(`Classes: ${classes}`)
  // Retrieving Styles
  const styleRegex = /style(=)(\"|\')[^"|']+(\"|\')/gi;
  let styles = fileText.match(styleRegex);
  // Removing the style tags from html component
  fileText = fileText.replace(styleRegex, "");
  console.log(`Style: ${styles}`);
  // Getting Index after </body>
  let afterBodyIndex = fileText.indexOf("</html>");
  // Adding a style tag after </body>
  fileText = fileText.slice(0, afterBodyIndex) + "<style>";
  // Appending styles from the styles list
  for (let style of styles) {
    style = style.match(/(?<=style\=")[^"]*(?=")/gi);
    fileText =
      fileText.slice(0, afterBodyIndex + "<style>".length) + `\n${style}`;
  }
  // Setting Appropriate closing tags
  fileText = fileText + "\n</style>\n</html>";
  console.log(
    `\n---------------------------------------Final File Text ->\n ${fileText} \n---------------------------------------`
  );
  fs.writeFile("test.html", fileText, () => {});
});
