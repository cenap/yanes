/*jslint node: true */
"use strict";
var configkeys = require('./config/configkeys.json');
var debug = require('debug')('yanes:app');
var express = require('express');
var jwt = require('jsonwebtoken');
var socket_io = require('socket.io');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');

var i18n = require("i18n");
var config = require('./config/config.js');

var app = express();

//Morgan Logger
var loggerOptions = {
    skip: function (req, res) { return res.statusCode < 400; }
};
app.use(logger('dev', loggerOptions));

// Socket.io
var io = socket_io();
app.io = io;

io.on('connection', function(socket) {
  debug('Someone has connected (socket)');
  socket.on('login', function(data) {
    var token = socket;
    socket.authenticated = false;
    debug('Authenticating: ' , data.token);
    if (data.token) {
      var verifiedJwt = jwt.verify(data.token, configkeys.jwtSecret, function(err, decoded) {
        if (err) {
          debug(err.message);
          socket.emit('notauthenticated',{'reason':err.message});
        } else {
          debug ("that someone is: " + decoded.username + " (socket)");
          socket.authenticated = true;
          socket.decoded = decoded;
          socket.emit('authenticated',{'hello':decoded.username});
        }
      });
    } else {
      socket.emit('notauthenticated',{'reason': 'no token'});
    }
  });

  socket.on('logout', function(data) {
    debug('Logging out: ' , data.token);
    if (data.token) {
      var verifiedJwt = jwt.verify(data.token, configkeys.jwtSecret, function(err, decoded) {
        if (err) {
          debug(err.message);
        } else {
          debug (decoded.username + " logged out (socket)");
          socket.authenticated = false;
          socket.emit('loggedout',{'good bye': decoded.username});
          delete socket.decoded;
        }
      });
    } else {
      socket.emit('notauthenticated',{'reason': 'no token'});
    }
  });

});



var routes = require('./routes/index');
var auth = require('./routes/api/auth');
var user = require('./routes/api/user');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use(i18n.init);

app.use('/', routes);
app.use('/api/auth', auth);
app.use('/api/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
