const fs = require('node:fs');
const path = require('node:path');

const fileName = path.join(__dirname, 'newFile.txt');

const writeStream = fs.createWriteStream(fileName);
const {stdin, stdout} = process;

stdout.write('Hello! Enter your text:\n');
stdin.on('data', text => {
  writeStream.write(text.toString());
  if(text.includes('exit')) process.exit();
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  console.log('Good Bye!');
});
