var debug = require('debug')('yanes:auth');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var BBMessage = require('../../models/BBMessage');
var User = require('../../models/user')();
var i18n  = require('i18n');

router.post('/register', function(req, res, next){
  var BBM = new BBMessage();
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    var verifiedJwt = jwt.verify(token,'server secret', function(err, decoded) {
      if (err) {
        BBM.setWarning(401); //401 : "Token geçersiz."
      } else {
        req.decoded = decoded;
        BBM.setData({ tokenverified: true, username : decoded.username });
      }
      res.send(BBM);
    });
  } else {
    BBM.setWarning(401); //401 : "Token geçersiz."
    BBM.setData({ tokenverified: false });
    res.send(BBM);
  }
});

module.exports = router;
