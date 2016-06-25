"use strict";
/*jslint node: true */

var bcrypt = require('bcrypt-nodejs');

module.exports = function() {

  var User = {
    id: null,
    username: null,
    password: null,
    find: function(user, callback) {
      //TODO: Do actual DB Query here
      if (user && user.username === "cenap") {
        callback(null, user);
      } else {
        callback(new Error('Cannot find user.'), null);
      }
    },

    findByEmail: function(user, callback) {
      //TODO: Do actual DB Query here
      if (user && user.email && isEmailValid(user.email)) {
        callback(null, user);
      } else {
        callback();
      }
    },

    updateOrCreate: function(user, cb) {
      //TODO: Do actual DB Operations here
      this.id = 1453;
      cb(null, user);
    },

    isPasswordValid: function(password) {
      return (password === "cenap");
      //return bcrypt.compareSync(password, this.password); //sadece bu satır kalacak
    },

    setPassword: function(password) {
      this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },

    sendPasswordResetEmail: function(password) {
      //TODO: create and send passport reset link in an email
    },
  };

  return (User);
};


function isEmailValid(mail) {
 return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
}
