const fs = require('node:fs');
const path = require('node:path');

const fileName = path.join(__dirname, 'text.txt');
const { stdout } = process;

// fs.readFile(fileName, 'utf8', (error, data) => {
//   if (error) throw error;
//   console.log(data);
// });

const readStream = fs.createReadStream(fileName);
readStream.on('error', (error) => {
  throw error;
});

readStream.on('data', (text) => {
  stdout.write(text);
});
