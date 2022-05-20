const fs = require('node:fs');
const path = require('node:path');

const fileName = path.join(__dirname, 'text.txt');
const { stdout } = process;

const readStream = fs.createReadStream(fileName);
readStream.on('error', (error) => {
  throw error;
});

readStream.on('data', (chunk) => {
  stdout.write(chunk);
});
