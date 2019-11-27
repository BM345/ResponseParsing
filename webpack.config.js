const path = require('path')      ;
let glob = require("glob");


let entry = {
  index: "./src/index.js",
  check: "./src/check.js",
};
let outputPath = "dist";

if (process.env.TESTBUILD) {
  entry =  glob.sync(__dirname + "/test/*_tests.js");
  outputPath = "test-dist";
}

module.exports = {
  entry: entry,
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, outputPath),
  }
};