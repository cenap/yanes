var debug = require('debug')('yanes:user');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var BBMessage = require('../../models/BBMessage');
var User = require('../../models/user')();
var i18n  = require('i18n');
var validator = require('validator');
var bbvalidator = require('../../tools/bbvalidator');

router.post('/register', validateRegistrationRequest, function(req, res, next){
  var BBM = new BBMessage();
  //TODO: Do actual registration here
  User.find({ username: req.body.username }, function (err, user) {
    if (err) {
      BBM.setError(100); //100 : "An error occurred."
      BBM.setData(err);
    }
    else {
      if (user) {
        BBM.setError(109); //109: "This username is already taken.",
      }
      else {
        User.find({ email: req.body.email }, function (err, user) {
          if (err) {
            BBM.setError(100); //100 : "An error occurred."
            BBM.setData(err);
          }
          else {
            if (user) {
              BBM.setError(110); //110: "A user with this email is already registered.",
            }
            else {
              //username and email OK. Do registration HERE
            }
          }
          res.send(BBM);
        });
      }
      res.send(BBM);
    }
    res.send(BBM);
  });
});

function validateRegistrationRequest(req, res, next) {
  var BBM = new BBMessage();

  if (req.body) {
    var username = req.body.username;
    var password = req.body.password;
    var email    = req.body.email;
    var options = {min:3, max: 20};
    bbvalidator.validateUsername(username,BBM);
    bbvalidator.validatePassword(password,BBM);
    bbvalidator.validateEmail(email,BBM);
  }
  else {
    BBM.setError(100);//100: "An error occurred.",
  }

  if (BBM.status<0) {
    res.send(BBM);
  } else {
    next();
  }
}

router.post('/changepassword', function(req, res, next){
  var BBM = new BBMessage();
  res.send(BBM);
});

router.post('/updateprofile', function(req, res, next){
  var BBM = new BBMessage();
  res.send(BBM);
});

router.post('/checkprofile', function(req, res, next){
  var BBM = new BBMessage();
  res.send(BBM);
});


module.exports = router;
