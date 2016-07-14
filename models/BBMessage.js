/*
BBMessage
Salih Cenap Baydar
27.05.2016
*/

/*jslint node: true */
"use strict";

var i18n = require('i18n');

var Messages = {
  800: "You have got message.",
  801: "Logged In",
  802: "Logged Out.",
  803: "An link was sent to your email address in order to reset your password.",
};

var ErrorMessages = {
  100: "An error occurred.",
  101: "Cannot login!",
  102: "Cannot logout!",
  103: "Missing required parameter(s).",
  104: "No user registered with this email address could be found.",
  105: "No user registered with this username could be found.",
  106: "Wrong password.",
  107: "Invalid email address.",
  108: "Invalid parameter(s).",
};

var WarningMessages = {
  400: "Warning!",
  401: "Invalid token.",
  402: "Already logged out.",
};

module.exports = function() {
  this.status = 0;

  this.setStatus = function(status) {
    this.status = status;
  };

  this.reset = function() {
    this.status = 0;
    delete this.message;
    delete this.error;
    delete this.warning;
    delete this.data;
  };

  this.setData = function(data) {
    this.data = data;
  };

  this.setDetail = function(key,value) {
    var label   = i18n.__(key);
    var detail  = {};
    detail[label] = i18n.__(value);
    this.data = [];
    this.data.push(detail);
  };

  this.addDetail = function(key,value) {
    var label   = i18n.__(key);
    var detail  = {};
    detail[label] = i18n.__(value);
    if (this.data instanceof Array) {
      this.data.push(detail);
    } else {
      this.data = [];
      this.data.push(detail);
    }
  };

  this.getMessage = function(MsgCode) {
    return (i18n.__(Messages[MsgCode]));
  };

  this.setMessage = function(MsgCode) {
    this.message = {
			"code" : MsgCode,
			"msg" : i18n.__(Messages[MsgCode])
		};
  };

  this.getError = function(ErrCode) {
    return (i18n.__(ErrorMessages[ErrCode]));
  };

  this.setError = function(ErrCode) {
    this.error = {
      "code": ErrCode,
      "msg": i18n.__(ErrorMessages[ErrCode])
    };
    this.status = -1;
  };

  this.getWarning = function(WrnCode) {
    return(i18n.__(WarningMessages[WrnCode]));
  };

  this.setWarning = function(WrnCode) {
    this.warning = {
      "code": WrnCode,
      "msg": i18n.__(WarningMessages[WrnCode])
    };
    this.status = 1;
  };

  this.addData = function(obj) {

    if (this.data && this.data.isArray) {
      if (this.data.indexOf(obj) === -1) {
        this.data.push(obj);
      }
    } else {
      this.data = [];
      this.data.push(obj);
    }
  };

  this.addError = function(ErrCode) {
    var err = {};
    err.code = ErrCode;
    err.msg = i18n.__(ErrorMessages[ErrCode]);

    if (this.errors && this.errors.isArray) {
      if (this.errors.indexOf(err) === -1) {
        this.errors.push(err);
      }
    } else {
      this.errors = [];
      this.errors.push(err);
    }

    this.status = -(this.errors.length);
  };

  this.addWarning = function(WrnCode) {
    var wrn = {};
    wrn.code = WrnCode;
    wrn.msg = i18n.__(WarningMessages[WrnCode]);

    if (this.warnings && this.warnings.isArray) {
      if (this.warnings.indexOf(wrn) === -1) {
        this.warnings.push(wrn);
      }
    } else {
      this.warnings = [];
      this.warnings.push(wrn);
    }
    this.status = this.warnings.length;
  };
};
