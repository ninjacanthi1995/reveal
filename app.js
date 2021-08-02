require('dotenv').config();
require("./models/db")
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var templatesRouter = require('./routes/templates');
var emailsRouter = require('./routes/emails');


var app = express();

app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));
// app.use(express.urlencoded({  }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/templates', templatesRouter);
app.use('/emails', emailsRouter);

app.get("*", (req, res) => {
  let url = path.join(__dirname, 'client/build', 'index.html');
  if (!url.startsWith('/app/')) // since we're on local windows
    url = url.substring(1);
  res.sendFile(url);
});

module.exports = app;
