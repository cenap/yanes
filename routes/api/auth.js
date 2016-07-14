var configkeys = require('../../config/configkeys.json');
var debug = require('debug')('yanes:auth');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var BBMessage = require('../../models/BBMessage');
var User = require('../../models/user')();
var i18n  = require('i18n');
var validator = require('validator');


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Giriş' });
});

router.post('/check', function(req, res, next){
  var BBM = new BBMessage();
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    var verifiedJwt = jwt.verify(token, configkeys.jwtSecret, function(err, decoded) {
      if (err) {
        BBM.setWarning(401); //401 : "Invalid token."
      } else {
        req.decoded = decoded;
        BBM.setData({ tokenverified: true, username : decoded.username });
      }
      res.send(BBM);
    });
  } else {
    BBM.setWarning(401); //401 : "Invalid token."
    BBM.setData({ tokenverified: false });
    res.send(BBM);
  }
});


router.post('/logout', function(req, res, next){
  var BBM = new BBMessage();
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    debug('token var:', token);
    var verifiedJwt = jwt.verify(token,configkeys.jwtSecret, function(err, decoded) {
      if (err) {
        debug('token geçersiz', err);
        BBM.setWarning(401); //401 : "Invalid token."
      } else {
        debug('token geçerli');
        BBM.setMessage(802); //802 : "Logged Out.",
      }
      res.send(BBM);
    });
  } else {
    debug('token yok');
    BBM.setWarning(402); //402 : "Already logged out.",
    res.send(BBM);
  }
});


router.post('/login', validateAuthenticationRequest, authenticate, serialize, generateToken, respond);


function validateAuthenticationRequest(req, res, next) {
  var BBM = new BBMessage();

  if (req.body) {
    var username = req.body.username;
    var password = req.body.password;
    var options = {min:3, max: 20};
    if (username) {
      if (validator.isLength(username, options) && validator.isAlphanumeric(username, 'tr-TR') ) {
        //OK
        debug(validator.isLength(username, options), validator.isAlphanumeric(username, 'tr-TR'));
      }
      else {
        BBM.setError(108);//108: "Invalid parameter(s).",
        BBM.addDetail('invalid','username');
      }
    }
    else {
      BBM.setError(103);//103: "Missing required parameter."
      BBM.addDetail('required','username');
    }

    options = {min:5, max: 20};
    if (password) {
      if (validator.isLength(password, options) && validator.isAlphanumeric(password, 'tr-TR') ) {
        //OK
      }
      else {
        BBM.setError(108);//108: "Invalid parameter(s).",
        BBM.addDetail('invalid','password');
      }
    }
    else {
      BBM.setError(103);//103: "Missing required parameter."
      BBM.addDetail('required','password');
    }

    BBM.addDetail('optional','remember');

    if (BBM.status<0) {
      res.send(BBM);
    } else {
      next();
    }

  }
  else {
    BBM.setError(103);//103: "Missing required parameter."
    BBM.addDetail('required','username');
    BBM.addDetail('required','password');
    BBM.addDetail('optional','remember');
    res.send(BBM);
  }

}



function authenticate(req, res, next) {
  var BBM = new BBMessage();

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      debug(err.message);
      if (info) {debug(info);}
      if (err.message==="Incorrect username." || err.message==="Cannot find user.") {
        BBM.setError(105);//105: "No user registered with this username could be found."
      } else if (err.message==="Incorrect password.") {
        BBM.setError(106);//106: "Wrong password."
      } else {
        BBM.setError(101);//101 : "Cannot login!"
      }
      res.send(BBM);
    } else if (!user) {
      BBM.setError(105);//105: "No user registered with this username could be found.",
      res.send(BBM);
    } else {
      req.logIn(user, {session:false}, function(err) {
        if (err) {
          debug(err);
          BBM.setError(101);//101 : "Cannot login!",
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
      BBM.setError(100); //100 : "An error occurred.",
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
    configkeys.jwtSecret, {expiresIn: expires});
  next();
}

function respond(req, res) {
  var BBM = new BBMessage();
  BBM.setMessage(801); //801 : "Logged In",
  BBM.setData({
    user: req.user,
    token: req.token
  });
  res.send(BBM);
}

router.post('/remindpassword', function (req, res, next){
  var BBM = new BBMessage();
  var email = req.body.email;
  if (email) {
    if (validator.isEmail(email)) {
      User.findByEmail({ email: email }, function (err, user) {
        if (err) {
          debug(err);
          BBM.setError(100); //100 : "An error occurred."
          BBM.setData(err);
        } else {
          if (user) {
            //TODO 1. Generate one time password reset link
            //TODO 2. Set link to user's email address
            User.sendPasswordResetEmail();
            BBM.setMessage(803);//803 : "An link was sent to your email address in order to reset your password.",
          } else {
            BBM.setError(104);//104 : "No user registered with this email address could be found."
          }
        }
        res.send(BBM);
      });
    } else {
      BBM.setError(107);//107: "Invalid email address."
      res.send(BBM);
    }
  } else {
    BBM.setError(103);//103 : "Missing required parameter."
    var label   = i18n.__('required');
    var details = {};
    details[label] = 'email';
    BBM.setData(details);
    res.send(BBM);
  }
});

module.exports = router;
