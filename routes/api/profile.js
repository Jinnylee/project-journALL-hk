var Joi    = require('joi');
var Authenticated = require("../modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
  ]);

  next();
};

exports.register.attributes = {
  name: 'profile-api',
  version: '0.0.1'
};