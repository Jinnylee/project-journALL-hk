var Authenticated = require("../modules/Authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/api/journals',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;

          //find 6 most recent journals
        db.collection('journals').find({}, {"sort" : ['datefield', 'asc']}).limit(6).toArray(function (err, results) {
          if (err) { return reply(err).code(400); }
          reply(results).code(200);
        });
          //.limit(6).sort({ date: -1 })

      }
    },
    // {
    //   method: 'GET',
    //   path: '/api/user/{username}/journals/{id}',
    //   handler: function(request, reply) {
    //     var db = request.server.plugins['hapi-mongodb'].db;
    //       reply(results).code(200);
    //     });
    //   }
    // }
  ]);

  next();
};

exports.register.attributes = {
  name: 'journals-api',
  version: '0.0.1'
};