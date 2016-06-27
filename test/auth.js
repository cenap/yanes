/* jshint -W030 */
var expect  = require("chai").expect;
var should  = require('chai').should();
var request = require("request");
var loginUrl = "http://localhost:3000/auth/login";
var logoutUrl = "http://localhost:3000/auth/logout";

describe('API:auth', function() {
  describe('login', function () {

    it('should return BBM json', function (done) {
      request.post({url:loginUrl}, function(err, httpResponse, body){
        httpResponse.statusCode.should.be.equal(200);
        httpResponse.headers['content-type'].should.include('json');
        httpResponse.body.should.exist;
        var BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.should.be.an('object');
        done(err);
      });
    });

    it('should return status=-1 and error.code=105 when no username/password given', function (done) {
      var data = null;//{"username":"cenap"};
      request.post({url:loginUrl, form: data}, function(err, httpResponse, body){
        var BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.status.should.equal(-1);
        BBM.error.code.should.equal(105);
        done(err);
      });
    });

    it('should return status=-1 and error.code=105 when non existent user aaaa/cenap given', function (done) {
      var data = {"username":"aaaa", "password":"cenap"};
      request.post({url:loginUrl, form: data}, function(err, httpResponse, body){
        var BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.should.be.an('object');
        BBM.status.should.equal(-1);
        should.exist(BBM.error);
        should.not.exist(BBM.data);
        BBM.error.code.should.equal(105);
        done(err);
      });
    });


    it('should return status=-1 and error.code=106 when wrong password is provided', function (done) {
      var data = {"username":"cenap", "password":"zzxcxzc", "remember": false};
      request.post({url:loginUrl, form: data}, function(err, httpResponse, body){
        var BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.should.be.an('object');
        BBM.status.should.equal(-1);
        should.exist(BBM.error);
        should.not.exist(BBM.data);
        BBM.error.code.should.equal(106);
        done(err);
      });
    });

    it('should return status=1, login and return jsonwebtoken with cenap:cenap:true', function (done) {
      var data = {"username":"cenap", "password":"cenap", "remember":true};
      request.post({url:loginUrl, form: data}, function(err, httpResponse, body){
        var BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.should.be.an('object');
        BBM.status.should.equal(0);
        BBM.message.code.should.equal(801);
        BBM.data.should.exist;
        BBM.data.token.should.exist;
        done(err);
      });
    });

  });






  describe('logout', function () {

    it('should return BBM json', function (done) {
      request.post({url:logoutUrl}, function(err, httpResponse, body){
        httpResponse.statusCode.should.be.equal(200);
        httpResponse.headers['content-type'].should.include('json');
        httpResponse.body.should.exist;
        var BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.should.be.an('object');
        done(err);
      });
    });

    it('should return warning code 402 without a token', function (done) {
      request.post({url:logoutUrl}, function(err, httpResponse, body){
        var BBM = JSON.parse(httpResponse.body);
        BBM.status.should.equal(1);
        BBM.warning.should.exist;
        BBM.warning.code.should.equal(402);
        done(err);
      });
    });

    it('should return warning code 401 without a valid token', function (done) {
      request.post({url:logoutUrl,headers:{'x-access-token':'invalidtoken'}}, function(err, httpResponse, body){
        var BBM = JSON.parse(httpResponse.body);
        BBM.status.should.equal(1);
        should.exist(BBM.warning);
        should.exist(BBM.warning.code);
        BBM.warning.code.should.equal(401);
        done(err);
      });
    });

    it('should return message code 802 with a valid token', function (done) {
      var data = {"username":"cenap", "password":"cenap", "remember":true};
      request.post({url:loginUrl, form: data}, function(err, httpResponse, body){
        var BBM = JSON.parse(httpResponse.body);
        var validtoken = BBM.data.token;
        request.post({url:logoutUrl,headers:{'x-access-token':validtoken}}, function(err, httpResponse, body){
          var BBM = JSON.parse(httpResponse.body);
          BBM.status.should.equal(0);
          should.exist(BBM.message);
          should.exist(BBM.message.code);
          BBM.message.code.should.equal(802);
          done(err);
        });
      });
    });

  });




});
