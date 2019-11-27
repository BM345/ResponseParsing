const path = require('path');

module.exports = {
  entry: {
    index: "./src/index.js",
    check: "./src/check.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /tests\.js$/,
        use: 'mocha-loader',
        exclude: /node_modules/,
      },
    ],
  },
};