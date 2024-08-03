const DatauriParser = require('datauri/parser');
const path = require('path');

const parser = new DatauriParser();

const getDataUri = (file) => {
  if (!file || !file.buffer || !file.originalname) {
    throw new Error('File is missing properties.');
  }
  return parser.format(path.extname(file.originalname).toString(), file.buffer);
};

module.exports = getDataUri;
