var debug = require('debug')('yanes:auth');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var BBMessage = require('../models/BBMessage');
var i18n  = require('i18n');

var User = require('../models/user')();

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Giriş' });
});

router.post('/check', function(req, res, next){
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
  }
});

router.post('/logout', function(req, res, next){
  var BBM = new BBMessage();
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    BBM.setMessage(802); //802 : "Çıkış yaptınız.",
  } else {
    BBM.setWarning(402); //402 : "Daha önce çıkış yapılmış.",
  }
  res.send(BBM);
});


router.post('/login', authenticate, serialize, generateToken, respond);


function authenticate(req, res, next) {
  var BBM = new BBMessage();
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      debug(err.message);
      if (info) {debug(info);}
      if (err.message==="Incorrect username." || err.message==="Cannot find user.") {
        BBM.setError(105);//105: "Bu isimle kayıtlı kullanıcı bulunamadı."
      } else if (err.message==="Incorrect password.") {
        BBM.setError(106);//106: "Yanlış şifre."
      } else {
        BBM.setError(101);//101 : "Giriş yapılamadı."
      }
      res.send(BBM);
    } else if (!user) {
      BBM.setError(105);//105: "Bu isimle kayıtlı kullanıcı bulunamadı.",
      res.send(BBM);
    } else {
      req.logIn(user, {session:false}, function(err) {
        if (err) {
          debug(err);
          BBM.setError(101);//101 : "Giriş yapılamadı.",
          res.send(BBM);
        }
        next();
      });
    }
  })(req, res, next);
}

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.find({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(new Error('Incorrect username.'), false, { message: 'Incorrect username:' + username});
      }
      if (!User.isPasswordValid(password)) {
        return done(new Error('Incorrect password.'), false, { message: 'Incorrect password:' + password });
      }
      user.username = username;
      return done(null, user);
    });
  }
));


function serialize(req, res, next) {
  var BBM = new BBMessage();
  User.updateOrCreate(req.user, function(err, user){
    if(err) {
      BBM.setError(100); //100 : "Bir hata oluştu.",
      BBM.setData({"details": err.toString()});
      res.send(BBM);
    }
    // we store the updated information in req.user again
    req.user = {
      id: user.id,
      username : user.username
    };
    next();
  });
}

function generateToken(req, res, next) {
  var expires = "120m";
  if (req.body.remember) {
    expires = "360d";
  }
  req.token = jwt.sign(
    {
      id: req.user.id,
      username: req.user.username
    },
    'server secret', {expiresIn: expires});
  next();
}

function respond(req, res) {
  var BBM = new BBMessage();
  BBM.setMessage(801); //801 : "Giriş başarılı",
  BBM.setData({
    user: req.user,
    token: req.token
  });
  res.send(BBM);
}

router.post('/remindpassword', function (req, res, next){
  var BBM = new BBMessage();
  var email = req.body.email;
  debug(email);
  if (email && email.length>3) {
    User.findByEmail({ email: email }, function (err, user) {
      if (err) {
        debug(err);
        BBM.setError(100); //100 : "Bir hata oluştu.",
        BBM.setData(err);
      } else {
        if (user) {
          //TODO 1. Generate one time password reset link
          //TODO 2. Set link to user's email address
          User.sendPasswordResetEmail();
          BBM.setMessage(803);//803 : "Şifrenizi sıfırlamanız için email adresinize bir link gönderildi.",
        } else {
          BBM.setError(104);//104 : "Bu emaille kayıtlı kullanıcı bulunamadı.",
        }
      }
      res.send(BBM);
    });
  } else {
    BBM.setError(103);//103 : "Gerekli bilgi eksik.",
    var label   = i18n.__('beklenen');
    var details = {};
    details[label] = 'email';
    BBM.setData(details);
    res.send(BBM);
  }
});

module.exports = router;
