var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');

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
      }
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

//router.post('/login', passport.authenticate('local', {session:false}), serialize, generateToken, respond);
router.post('/login', authenticate, serialize, generateToken, respond);

router.post('/check', function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    var verifiedJwt = jwt.verify(token,'server secret', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        console.log(decoded);
        req.decoded = decoded;
        res.status(200).json({ tokenverified: true, username : decoded.username });
      }
    });
  }
});

function authenticate(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/auth/login'); }
    req.logIn(user, {session:false}, function(err) {
      if (err) { return next(err); }
      //return res.redirect('/users/' + user.username);
      next();
    });
  })(req, res, next);
}

function serialize(req, res, next) {
  User.updateOrCreate(req.user, function(err, user){
    if(err) {
      return next(err);
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
  req.token = jwt.sign(
    {
      id: req.user.id,
      username: req.user.username
    },
    'server secret', {expiresIn: "120m"});
  next();
}

function respond(req, res) {
  res.status(200).json({
    user: req.user,
    token: req.token
  });
}

module.exports = router;
