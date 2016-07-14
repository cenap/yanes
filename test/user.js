/* jshint -W030 */
var debug = require('debug')('yanes:test:user');
var expect  = require("chai").expect;
var should  = require('chai').should();
var request = require("request");
var config = require("../config/config");
var BBMessage = require("../models/BBMessage");
var registerUrl = "http://localhost:3000/api/user/register";
var updateprofileUrl = "http://localhost:3000/api/user/updateprofile";
var checkprofileUrl = "http://localhost:3000/api/user/checkprofile";


  /*
  * REGISTER
  */

describe('API:user', function() {
  var BBM = new BBMessage();

  describe('register', function () {

    it('should return BBM json', function (done) {
      request.post({url:registerUrl}, function(err, httpResponse, body){
        httpResponse.statusCode.should.be.equal(200);
        httpResponse.headers['content-type'].should.include('json');
        httpResponse.body.should.exist;
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.should.be.an('object');
        done(err);
      });
    });

    it('should return status=-1 and error.code=103 (' + BBM.getError(103) + ') when no username/password given', function (done) {
      var data = null;
      request.post({url:registerUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.status.should.equal(-1);
        BBM.error.code.should.equal(103);
        done(err);
      });
    });

    it('should return status=-1 and error.code=103 (' + BBM.getError(103) + ') when username is provided without a password', function (done) {
      var data = {"username":"aaaa", "password":""};
      request.post({url:registerUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.status.should.equal(-1);
        BBM.error.code.should.equal(103);
        done(err);
      });
    });

    it('should return status=-1 and error.code=103 (' + BBM.getError(103) + ') when password is provided without a username', function (done) {
      var data = {"username":"", "password":"aaaaaa"};
      request.post({url:registerUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.status.should.equal(-1);
        BBM.error.code.should.equal(103);
        done(err);
      });
    });

    it('should return status=-1 and error.code=103 (' + BBM.getError(103) + ') when email is not provided', function (done) {
      var data = {"username":"aaaaaa", "password":"aaaaaaa", "email":""};
      request.post({url:registerUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.status.should.equal(-1);
        BBM.error.code.should.equal(103);
        done(err);
      });
    });

    it('should return status=-1 and error.code=108 (' + BBM.getError(108) + ') when invalid password is provided with username', function (done) {
      var data = {"username":"aaaaaa", "password":"a", "email":"cenap@cenap.com"};
      request.post({url:registerUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.status.should.equal(-1);
        BBM.error.code.should.equal(108);
        done(err);
      });
    });

    it('should return status=-1 and error.code=108 (' + BBM.getError(108) + ') when invalid username is provided with password', function (done) {
      var data = {"username":"a", "password":"aaaaaa", "email":"cenap@cenap.com"};
      request.post({url:registerUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.status.should.equal(-1);
        BBM.error.code.should.equal(108);
        done(err);
      });
    });

    it('should return status=-1 and error.code=108 (' + BBM.getError(108) + ') when non alphanumeric username is provided with password', function (done) {
      var data = {"username":"aaa!?aa", "password":"aaaaaa", "email":"cenap@cenap.com"};
      request.post({url:registerUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.status.should.equal(-1);
        BBM.error.code.should.equal(108);
        done(err);
      });
    });

  });

});
