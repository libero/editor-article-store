const chokidar = require('chokidar');
const AWS = require('aws-sdk');
const fs = require('fs');
const nodePath = require('path');
const { env } = require('process');

const s3 = new AWS.S3({ 
  endpoint: 'http://localstack:4566', 
  apiVersion: '2006-03-01',
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey', 
  s3ForcePathStyle: true 
});
const watcher = chokidar.watch('/bucket-to-watch');
console.log('listening for files and mapping to bucket: ' + process.env.S3BUCKET);
watcher
  .on('add', path => {
    console.log(`File ${path} has been added`);
    const fileContent = fs.readFileSync(path);
    var params = {
      Body: fileContent, 
      Bucket: process.env.S3BUCKET, 
      Key: nodePath.basename(path)
     };
     s3.putObject(params, function(err, data) {
       if (err) console.log(err, err.stack);
       else     console.log(data); 
     });
  })