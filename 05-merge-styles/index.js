const fs = require('node:fs');
const path = require('node:path');

const copyTo = path.join(__dirname, 'project-dist'); 
const copyFrom = path.join(__dirname, 'styles'); 

// const writeStream = fs.createWriteStream(path.join(copyTo, 'bindle.css'));

fs.readdir(copyFrom, (error, files) => {
  if(error) throw error;
  
  files.forEach(file => {
    const name = path.join(copyFrom, file);
    if (path.extname(name) === '.css') {
      const readStream = fs.createReadStream(path.join(copyFrom, file));
      readStream.on('error', (error) => {
        throw error;
      });
      
      readStream.on('data', (chunk) => {
        fs.appendFile(
          path.join(copyTo, 'bundle.css'),
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
