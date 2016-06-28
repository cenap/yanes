var debug = require('debug')('yanes:auth');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var BBMessage = require('../../models/BBMessage');
var User = require('../../models/user')();
var i18n  = require('i18n');
var validator = require('validator');

router.post('/register', function(req, res, next){
  var BBM = new BBMessage();
  res.send(BBM);
});

module.exports = router;
