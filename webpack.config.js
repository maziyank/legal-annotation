const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: 'annotation.js',
    path: path.resolve(__dirname, 'dist'),
    library: "annotate"
  },
};