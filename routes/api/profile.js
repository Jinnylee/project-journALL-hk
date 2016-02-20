var Joi    = require('joi');
var Authenticated = require("../modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/profile/{username}',
      handler: function (request, reply) {
        console.log(request);
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var username = ObjectID(request.params.username);

          db.collection('journals').findOne({"username": username},
            function (err, user) {
              if (err) { return reply(err); }

              reply.view('static_pages/profile', {user:user}).code(200);
            }
          )

      }
    }

  ]);

  next();
  }
};

exports.register.attributes = {
  name: 'profile-api',
  version: '0.0.1'
};