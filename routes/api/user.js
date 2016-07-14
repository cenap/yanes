var debug = require('debug')('yanes:auth');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var BBMessage = require('../../models/BBMessage');
var User = require('../../models/user')();
var i18n  = require('i18n');
var validator = require('validator');

router.post('/register', validateRegistrationRequest, function(req, res, next){
  var BBM = new BBMessage();
  //TODO: Do actual registration here
  res.send(BBM);
});

function validateRegistrationRequest(req, res, next) {
  var BBM = new BBMessage();

  if (req.body) {

    var username = req.body.username;
    var password = req.body.password;
    var options = {min:3, max: 20};
    if (username) {
      if (validator.isLength(username, options) && validator.isAlphanumeric(username, 'tr-TR') ) {
        //OK
      }
      else {
        BBM.addDetail('invalid','username');
      }
    }
    else {
      BBM.setError(103);//103: "Missing required parameter."
      BBM.addDetail('required','username');
    }

    options = {min:6, max: 20};
    if (password) {
      if (validator.isLength(password, options) && validator.isAlphanumeric(password, 'tr-TR') ) {
        //OK
      }
      else {
        BBM.addDetail('invalid','password');
      }
    }
    else {
      BBM.setError(103);//103: "Missing required parameter(s)."
      BBM.addDetail('required','password');
    }
  }
  else {
    BBM.setError(103);//103: "Missing required parameter(s)."
    BBM.addDetail('required','username');
    BBM.addDetail('required','password');
  }

  if (BBM.status<0) {
    res.send(BBM);
  } else {
    next();
  }
}

router.post('/updateprofile', function(req, res, next){
  var BBM = new BBMessage();
  res.send(BBM);
});

router.post('/checkprofile', function(req, res, next){
  var BBM = new BBMessage();
  res.send(BBM);
});


module.exports = router;
