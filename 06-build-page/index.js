const fs = require('node:fs');
const path = require('node:path');

const mainDirectory= __dirname;
let copyDirectory = path.join(mainDirectory, 'project-dist');
const stylesForCopy = path.join(mainDirectory, 'styles'); //
const assetsPathForCopy = path.join(mainDirectory, 'assets'); 

const createFolder = (folderName) => {
  fs.access(folderName, (error) => {
    if (error) {
      fs.mkdir(folderName, (error) => {
        if (error) throw error;
      });
    }
  });
};

//copy styles
fs.readdir(stylesForCopy, (error, files) => {
  if(error) throw error;
  
  files.forEach(file => {
    const name = path.join(stylesForCopy, file);
    if (path.extname(name) === '.css') {
      const readStream = fs.createReadStream(path.join(stylesForCopy, file));
      readStream.on('error', (error) => {
        throw error;
      });
      
      readStream.on('data', (chunk) => {
        fs.appendFile(
          path.join(copyDirectory, 'styles.css'),
          chunk.toString(),
          'utf8',
          (err) => {
            if (err) throw err;
          }
        );
      });
    }
  });
});

const copyFile = (readPath, writePath) => {
  const readStream = fs.createReadStream(readPath.toString());
  const writeStream = fs.createWriteStream(writePath);
  readStream.pipe(writeStream);
  writeStream.end();
};

const { basename } = require('path');

const readFolder = (folderPath, destinationPath) => {
  const folderName = basename(folderPath);
  createFolder(path.join(destinationPath, folderName));
  fs.readdir(folderPath, (error, files) => {
    if (error) throw error;
    files.forEach(item => {
      fs.stat(path.join(folderPath, item), (error, stats) => {
        if (error) throw error;
        if(stats.isFile()) {
          copyFile(path.join(folderPath, item), path.join(destinationPath, folderName, item));
        } else {
          readFolder(path.join(folderPath, item), path.join(destinationPath, folderName));
        }
      });
    });
  });
};

createFolder(copyDirectory);

readFolder(assetsPathForCopy, copyDirectory);