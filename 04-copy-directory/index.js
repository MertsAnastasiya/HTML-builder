const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('fs').promises;

const copyFrom= path.join(__dirname, 'files');
const copyTo= path.join(__dirname, 'files-copy');

fs.readdir(copyFrom, (error, files) => {
  if(error) throw error; 
  fs.access(copyTo, async () => {
    await fsPromises.rm(copyTo, { recursive: true, force: true });
    fs.mkdir(copyTo, (error) => {
      if (error)  throw error;
      console.log('Create folder');
      copyFiles(files);
    });
  });
});


const copyFiles = (files) => {
  files.forEach(file => {
    const readStream = fs.createReadStream(path.join(copyFrom, file));
    const writeStream = fs.createWriteStream(path.join(copyTo,file));
    readStream.pipe(writeStream);
  });
};
