/*
BBMessage
Salih Cenap Baydar
27.05.2016
*/

/*jslint node: true */
"use strict";

var i18n  = require('i18n');

var Messages = {
	800 : "Mesajınız var",
	801 : "Giriş başarılı",
};

var ErrorMessages = {
	100 : "Bir hata oluştu.",
	101 : "Giriş yapılamadı.",
};

var WarningMessages = {
	400 : "Bir uyarı var.",
	401 : "Token geçersiz."
};

module.exports = function(){
	this.status  = 0;

	this.setStatus = function(status){
		this.status = status;
	};

	this.reset = function(){
	    this.status = 0;
	    delete this.message;
	    delete this.error;
	    delete this.warning;
	    delete this.data;
	};

	this.setData = function(data){
		this.data = data;
	};

	this.setMessage = function(messagecode){
		this.message = i18n.__(Messages[messagecode]);
	};

	this.setError = function(ErrCode){
	    this.error = {"code":ErrCode,"msg": i18n.__(ErrorMessages[ErrCode])};
	    this.status = -1;
	};

	this.setWarning = function(WrnCode){
	    this.warning = {"code":WrnCode,"msg": i18n.__(WarningMessages[WrnCode])};
	    this.status = 1;
	};

	this.addData = function(obj){

		if (this.data && this.data.isArray){
			if (this.data.indexOf(obj)===-1){
				this.data.push(obj);
			}
		} else {
			this.data = [];
			this.data.push(obj);
		}
	};

	this.addError = function(ErrCode){
		var err = {};
		err.code = ErrCode;
		err.msg  = i18n.__(ErrorMessages[ErrCode]);

		if (this.errors && this.errors.isArray){
			if (this.errors.indexOf(err)===-1){
				this.errors.push(err);
			}
		} else {
			this.errors = [];
			this.errors.push(err);
		}

		this.status = -(this.errors.length);
	};

	this.addWarning = function(WrnCode){
		var wrn = {};
		wrn.code = WrnCode;
		wrn.msg  = i18n.__(WarningMessages[WrnCode]);

		if (this.warnings && this.warnings.isArray){
			if (this.warnings.indexOf(wrn)===-1){
				this.warnings.push(wrn);
			}
		} else {
			this.warnings = [];
			this.warnings.push(wrn);
		}
		this.status = this.warnings.length;
	};
};
