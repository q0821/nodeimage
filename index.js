const gm = require('gm')
const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const morgan = require('morgan')
const md5 = require('md5')
const frameSetting = [
  '235,140 1375, 885',
  '115,150 1375, 885',
  '1290,825 1375, 885',
  '1330,125 1375, 885',
  '1330,125 1375, 885'
]

// app.use(cors())
app.use(function (req, res, next) {
  // console.log('add header')
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})
app.use(fileUpload())
app.use(morgan('dev'))
app.use('/file', express.static('./file'))

// POST method route
app.post('/send/:room/:frame', function (req, res) {
  var room = req.params.room
  var frame = req.params.frame
  if (!req.files) {
    return res.status(400).send('No files were uploaded.')
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  var sampleFile = req.files.slim_output_0
  var filename = md5(new Date().getTime() + sampleFile.name)
  // Use the mv() method to place the file somewhere on your server 
  console.log(sampleFile)
  sampleFile.mv('./file/' + room + '/upload/' + filename + '.jpg', function (err) {
    if (err) {
      return res.status(500).send(err)
    }
    gm('./file/' + room + '/resource/' + frame + '.jpg')
      .draw('image Over ' + frameSetting[frame - 1] + ' "./file/' + room + '/upload/' + filename + '.jpg')
      .write('./file/' + room + '/output/' + filename + '.jpg', function (err) {
        if (!err) {
          console.log('done')
          // res.sendFile('/output/filename.jpg');
          // res.sendFile(path.join(__dirname, './output', 'filename.jpg'));
          // return res.send('oooo');
          return res.json({
            'status': 'success',
            'name': filename + '.jpg',
            'path': 'http://hd.tellustek.com:3000/file/' + room + '/output/' + filename + '.jpg'
          })
        } else {
          console.log(err.message || '出错了！')
          return res.json({
            errcode: 1,
            data: {
              message: '出錯了！'
            }
          })
        }
      })
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
