var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var BBMessage = require('../models/BBMessage');

var User = {
  id: null,
  findOne: function(user, cb) {
    if (user.username==="cenap"){
      user.validPassword = function(password) {
        if (password==="cenap") {
          return true;
        } else {
          return false;
        }
      };
      return cb(null, user);
    } else {
      return cb( new Error('Incorrect username.') , null);
    }
  },
  updateOrCreate: function(user, cb) {
    user.id = 1453;
    cb (null,user);
  }
};

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      user.username = username;
      return done(null, user);
    });
  }
));

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Giriş' });
});




router.post('/check', function(req, res, next){
  var BBM = new BBMessage();
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    var verifiedJwt = jwt.verify(token,'server secret', function(err, decoded) {
      if (err) {
        //return res.json({ success: false, message: 'Failed to authenticate token.' });
        BBM.setWarning(401); //401 : "Token geçersiz."
      } else {
        //console.log(decoded);
        req.decoded = decoded;
        BBM.setData({ tokenverified: true, username : decoded.username });
        //res.status(200).json({ tokenverified: true, username : decoded.username });
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
    if (err || !user) {
      BBM.setError(101);//101 : "Giriş yapılamadı.",
      res.send(BBM);
    } else {
      req.logIn(user, {session:false}, function(err) {
        if (err) {
          BBM.setError(101);//101 : "Giriş yapılamadı.",
          res.send(BBM);
        }
        next();
      });
    }
  })(req, res, next);
}

function serialize(req, res, next) {
  var BBM = new BBMessage();
  User.updateOrCreate(req.user, function(err, user){
    if(err) {
      BBM.setError(100);
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
  /*
  res.status(200).json({
    user: req.user,
    token: req.token
  });
  */
}

module.exports = router;
