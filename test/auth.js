/* jshint -W030 */
var debug = require('debug')('yanes:test:auth');
var expect  = require("chai").expect;
var should  = require('chai').should();
var request = require("request");
var config = require("../config/config");
var BBMessage = require("../models/BBMessage");
var loginUrl = "http://localhost:3000/auth/login";
var logoutUrl = "http://localhost:3000/auth/logout";
var checkUrl = "http://localhost:3000/auth/check";


  /*
  * LOGIN
  */

describe('API:auth', function() {
  var BBM = new BBMessage();

  describe('login', function () {

    it('should return BBM json', function (done) {
      request.post({url:loginUrl}, function(err, httpResponse, body){
        httpResponse.statusCode.should.be.equal(200);
        httpResponse.headers['content-type'].should.include('json');
        httpResponse.body.should.exist;
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.should.be.an('object');
        done(err);
      });
    });

    it('should return status=-1 and error.code=105 (' + BBM.getError(105) + ') when no username/password given', function (done) {
      var data = null;//{"username":"cenap"};
      request.post({url:loginUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.status.should.equal(-1);
        BBM.error.code.should.equal(105);
        done(err);
      });
    });

    it('should return status=-1 and error.code=105 (' + BBM.getError(105) + ') when non existent user aaaa/cenap given', function (done) {
      var data = {"username":"aaaa", "password":"cenap"};
      request.post({url:loginUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.should.be.an('object');
        BBM.status.should.equal(-1);
        should.exist(BBM.error);
        should.not.exist(BBM.data);
        BBM.error.code.should.equal(105);
        done(err);
      });
    });


    it('should return status=-1 and error.code=106 (' + BBM.getError(106) + ') when wrong password is provided', function (done) {
      var data = {"username":"cenap", "password":"zzxcxzc", "remember": false};
      request.post({url:loginUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.should.be.an('object');
        BBM.status.should.equal(-1);
        should.exist(BBM.error);
        should.not.exist(BBM.data);
        BBM.error.code.should.equal(106);
        done(err);
      });
    });

    it('should return status=1, message.code:801 (' + BBM.getMessage(801) + ') login and return jsonwebtoken with cenap:cenap:true', function (done) {
      var data = {"username":"cenap", "password":"cenap", "remember":true};
      request.post({url:loginUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
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




  /*
  * LOGOUT
  */

  describe('logout', function () {


    it('should return BBM json', function (done) {
      request.post({url:logoutUrl}, function(err, httpResponse, body){
        httpResponse.statusCode.should.be.equal(200);
        httpResponse.headers['content-type'].should.include('json');
        httpResponse.body.should.exist;
        BBM = JSON.parse(httpResponse.body);
        BBM.should.exist;
        BBM.should.be.an('object');
        done(err);
      });
    });

    it('should return warning code 402 (' + BBM.getWarning(402) + ') without a token', function (done) {
      request.post({url:logoutUrl}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.status.should.equal(1);
        should.exist(BBM.warning);
        should.exist(BBM.warning.code);
        BBM.warning.code.should.equal(402);
        done(err);
      });
    });

    it('should return warning code 401 (' + BBM.getWarning(401) + ') without a valid token', function (done) {
      request.post({url:logoutUrl,headers:{'x-access-token':'invalidtoken'}}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        BBM.status.should.equal(1);
        should.exist(BBM.warning);
        should.exist(BBM.warning.code);
        BBM.warning.code.should.equal(401);
        done(err);
      });
    });

    it('should return message code 802 (' + BBM.getMessage(802) + ') with a valid token', function (done) {
      //First get a valid token
      var data = {"username":"cenap", "password":"cenap", "remember":true};
      request.post({url:loginUrl, form: data}, function(err, httpResponse, body){
        BBM = JSON.parse(httpResponse.body);
        var validtoken = BBM.data.token;
        request.post({url:logoutUrl,headers:{'x-access-token':validtoken}}, function(err, httpResponse, body){
          if (err) {console.log(err);}
          BBM = JSON.parse(httpResponse.body);
          BBM.status.should.equal(0);
          should.exist(BBM.message);
          should.exist(BBM.message.code);
          BBM.message.code.should.equal(802);
          done(err);
        });
      });
    });

  });







    /*
    * CHECK
    */
    describe('check', function () {

      it('should return BBM json', function (done) {
        request.post({url:checkUrl}, function(err, httpResponse, body){
          httpResponse.statusCode.should.be.equal(200);
          httpResponse.headers['content-type'].should.include('json');
          httpResponse.body.should.exist;
          BBM = JSON.parse(httpResponse.body);
          BBM.should.exist;
          BBM.should.be.an('object');
          done(err);
        });
      });

      it('should return warning code 401 (' + BBM.getWarning(401) + ') without a token', function (done) {
        request.post({url:checkUrl}, function(err, httpResponse, body){
          BBM = JSON.parse(httpResponse.body);
          BBM.status.should.equal(1);
          should.exist(BBM.warning);
          should.exist(BBM.warning.code);
          BBM.warning.code.should.equal(401);
          done(err);
        });
      });

      it('should return warning code 401 (' + BBM.getWarning(401) + ') without a valid token', function (done) {
        request.post({url:checkUrl,headers:{'x-access-token':'invalidtoken'}}, function(err, httpResponse, body){
          BBM = JSON.parse(httpResponse.body);
          BBM.status.should.equal(1);
          should.exist(BBM.warning);
          should.exist(BBM.warning.code);
          BBM.warning.code.should.equal(401);
          done(err);
        });
      });

      it('should return tokenverified=true with a valid token', function (done) {
        //First get a valid token
        var data = {"username":"cenap", "password":"cenap", "remember":true};
        request.post({url:loginUrl, form: data}, function(err, httpResponse, body){
          BBM = JSON.parse(httpResponse.body);
          var validtoken = BBM.data.token;
          request.post({url:checkUrl,headers:{'x-access-token':validtoken}}, function(err, httpResponse, body){
            BBM = JSON.parse(httpResponse.body);
            BBM.status.should.equal(0);
            should.exist(BBM.data);
            should.exist(BBM.data.tokenverified);
            BBM.data.tokenverified.should.equal(true);
            done(err);
          });
        });
      });

    });





});
