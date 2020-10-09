const chokidar = require('chokidar');
const AWS = require('aws-sdk');
const fs = require('fs');
const nodePath = require('path');

const s3 = new AWS.S3({ endpoint: 'http://localhost:4566', s3ForcePathStyle: true });
const watcher = chokidar.watch('../tmp/kryiaBucket');

watcher
  .on('add', path => {
    console.log(`File ${path} has been added`);
    const fileContent = fs.readFileSync(path);
    var params = {
      Body: fileContent, 
      Bucket: "kryia", 
      Key: nodePath.basename(path)
     };
     s3.putObject(params, function(err, data) {
       if (err) console.log(err, err.stack);
       else     console.log(data); 
     });
  })