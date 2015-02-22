require('angular');
require('angular-animate');
var ngWebSocket = require('angular-websocket');

var filters = require('./filters');
var services = require('./services');
var controllers = require('./controllers');

module.exports = angular.module('chat', [
  'ngAnimate',
  ngWebSocket.name,
  filters.name,
  controllers.name,
  services.name
]);

