const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('fs').promises;

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

let stylesArray = [];

fs.readdir(stylesForCopy, (error, files) => {
  if(error) throw error;
  
  files.forEach(async (file) => {
    const name = path.join(stylesForCopy, file);
    if (path.extname(name) === '.css') {
      await fsPromises.readFile(name)
        .then(function(result) {
          stylesArray.push(result);
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    fsPromises.writeFile(path.join(copyDirectory, 'style.css'), stylesArray.join())
      .then(() => {
      })
      .catch(er => {
        console.log(er);
      });
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

const createHtmlFile = () => {
  let strChunk = '';
  // let newStr = '';
  const readStream = fs.createReadStream(path.join(mainDirectory, 'template.html'));
  readStream.on('error', (error) => {
    throw error;
  });
  
  readStream.on('data', (chunk) => {
    strChunk += chunk.toString();
  });

  fs.readdir(path.join(mainDirectory, 'components'), (error, filesHtml) => {
    filesHtml.forEach(file => {
      if (path.extname(file) === '.html') {
        const readComponent = fs.createReadStream(path.join(mainDirectory, 'components', file));
        readComponent.on('error', (error) => {
          throw error;
        });
        
        readComponent.on('data', (chunk) => {
          const partForReplace = `{{${path.basename(file, '.html')}}}`;
          const newPart = chunk.toString();
          strChunk = strChunk.replace(partForReplace, newPart);
          const wrirteHtml = fs.createWriteStream(path.join(copyDirectory, 'index.html'));
          wrirteHtml.write(strChunk);
        });
      }
    });
  });
  
};

// readStream.on('end', () => {
//   const readHeader = fs.createReadStream(path.join(mainDirectory, 'components', 'header.html'));
//   readHeader.on('error', (error) => {
//     throw error;
//   });

//   const readHeader = fs.createReadStream(path.join(mainDirectory, 'components', 'header.html'));
//   readHeader.on('error', (error) => {
//     throw error;
//   });

//   readHeader.on('data', (chunk) => {
//     const newStr = strChunk.replace('{{header}}', chunk);
//     fs.appendFile(path.join(copyDirectory, 'index.html'), newStr, function (err) {
//       if (err) throw err;
//       console.log('Saved!');
//     });
//   });
    
    
// });
// };
 

createHtmlFile();