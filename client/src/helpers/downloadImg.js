const fetch = require("node-fetch");
const fs = require("fs");

module.exports = async function (url, path) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFileSync(path, buffer, () => console.log("finished downloading!"));
};
