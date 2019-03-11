var express = require('express');
var path = require('path');

var logger = require('morgan');

// var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('./src/helpers/jwt');
var errorHandler = require('./src/helpers/error-handler');

var usersRouter = require('./src/routes/users');
var countRouter = require('./src/routes/count');
var trackRouter = require('./src/routes/track');

var app = express();

app.use(logger('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use JWT auth to secure the api
app.use(jwt());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/count', countRouter);
app.use('/track', trackRouter);

global.__basedir = __dirname;

// global error handler
app.use(errorHandler);

module.exports = app;
