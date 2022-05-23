const fs = require('node:fs');
const path = require('node:path');

const fileName = path.join(__dirname, 'secret-folder');
const { stdout } = process;
stdout.write(fileName);


const readDirectory = (fileName) => {
  fs.readdir(fileName, (error, files) => {
    if(error) throw error; 
    files.map(item => {
      let fullPath = path.join(fileName, item);
      getResult(fullPath);
    });
  });
};

const getResult = (fullPath) => {
  fs.stat(fullPath, (error, stats) => {
    if(stats.isFile()) {
      const size = stats.size/1000 + 'kb';
      const extension = path.extname(fullPath);
      const name = path.basename(fullPath).replace(extension, '');
      console.log(`${name} - ${extension} - ${size}`);
    } else {
      readDirectory(fullPath);
    }
  });
};


console.log('\nFiles: ');
readDirectory(fileName);