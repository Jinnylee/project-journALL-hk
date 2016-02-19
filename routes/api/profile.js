var Authenticated = require("../modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/api/{username}',
      handler: function(request, reply) {
        var username = encodeURIComponent(request.params.username);
        var db = request.server.plugins['hapi-mongodb'].db;

        db.collection('users').findOne({ "username": username }, function(err, user) {
          if (err) { return reply('Internal MongoDB error', err).code(400); }

          reply(user).code(200);
        });
    }

  next();
};

exports.register.attributes = {
  name: 'profile-api',
  version: '0.0.1'
};