var Joi    = require('joi');
var Authenticated = require("../modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/profile/{username}',
      handler: function (request, reply) {
        Authenticated(request, function (result) {

          var db = request.server.plugins['hapi-mongodb'].db;
          // var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var username = encodeURIComponent(request.params.username);

          db.collection('users').findOne({"username": username},
            function (err, user) {
              if (err) { return reply('Internal MongoDB error', err).code(400); }

              db.collection('journals').find({"username": username}).limit(6).toArray(function (err, journals) {
                    if (err) { return reply ('Internal MongoDB error', err).code(400);}
                    result['journals'] = journals;
                  }
                );

                result['user'] = user;
                reply.view('profile', result).code(200);
            }
          )
        });
      }
    },
    // {
    //   method: 'GET',
    //   path: '/profile/{username}',
    //   handler: function (request, reply) {
    //     Authenticated(request, function(result) {
    //       var db = request.server.plugins['hapi-mongodb'].db;
    //       var username = encodeURIComponent(request.params.username);
    //       console.log(reply);

    //       db.collection('journals').find({"username": username}).limit(6).toArray(function (err, journals) {
    //         if (err) { return reply ('Internal MongoDB error', err).code(400);}

    //           reply.view('profile', {journals: journals, authenticated: result.authenticated}).code(200);
    //       });
    //     });
    //   }
    // }

  ]);

  next();

}

exports.register.attributes = {
  name: 'profile-api',
  version: '0.0.1'
};