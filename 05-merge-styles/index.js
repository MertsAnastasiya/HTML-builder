const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('fs').promises;

const copyTo = path.join(__dirname, 'project-dist'); 
const copyFrom = path.join(__dirname, 'styles'); 

let stylesArray = [];

fs.readdir(copyFrom, (error, files) => {
  if(error) throw error;
  
  files.forEach(async (file) => {
    const name = path.join(copyFrom, file);
    if (path.extname(name) === '.css') {
      await fsPromises.readFile(name)
        .then(function(result) {
          stylesArray.push(result);
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    fsPromises.writeFile(path.join(copyTo, 'bundle.css'), stylesArray.join())
      .then(() => {
      })
      .catch(er => {
        console.log(er);
      });
  });
});
