/*
config
Salih Cenap Baydar
27.05.2016
*/

/*jslint node: true */
"use strict";
var i18n = require("i18n");


i18n.configure({
  locales: ['en', 'tr'],
  directory: __dirname + '/locales'
});
