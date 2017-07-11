const fs = require('fs');
const gm = require('gm');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
// 使用 pug 當作template 
app.set('view engine', 'pug');
app.use(fileUpload());

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

// POST method route
app.post('/send/', function (req, res) {
  console.log(req.files);
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.sampleFile;
  // Use the mv() method to place the file somewhere on your server 
  console.log(sampleFile);
  sampleFile.mv('./upload/filename.jpg', function(err) {
    if (err){
      return res.status(500).send(err);
    }
    gm('./resources/dev/images/help/b1.jpg')
    .draw('image Over 233, 142 1374, 884 "./upload/filename.jpg"')
    .write('./output/filename.jpg', function(err) {
      if (!err) {
          console.log('done');
          // res.sendFile('/output/filename.jpg');
          res.sendFile(path.join(__dirname, './output', 'filename.jpg'));
      } else { 
        console.log(err.message || "出错了！"); 
      }
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});