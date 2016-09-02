"use strict";
/*jslint node: true */
var debug = require('debug')('yanes:bbvalidator');
var validator = require('validator');

module.exports = {
  validateUsername: function (username,BBM) {
    var options = {min:3, max: 20};
    if (username) {
      if (validator.isLength(username, options) && validator.isAlphanumeric(username, 'tr-TR') ) {
        //validated
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
  },

  validatePassword: function(password,BBM) {
    var options = {min:6, max: 20};
    if (password) {
      if (validator.isLength(password, options) && validator.isAlphanumeric(password, 'tr-TR') ) {
        //validated
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
  },

  validateEmail: function (email,BBM) {
    if (email) {
      if (validator.isEmail(email)) {
        //validated
      }
      else {
        BBM.setError(108);//108: "Invalid parameter(s).",
        BBM.addDetail('invalid','email');
      }
    }
    else {
      BBM.setError(103);//103: "Missing required parameter."
      BBM.addDetail('required','email');
    }
  }
};
