var Authenticated = require("../modules/authenticated.js");

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
    { // showing content in modal of one post
      method: 'GET',
      path: '/api/journals/{id}',
      handler: function(request, reply) {
        // Authenticated(request, function (result) {
        // if (result.authenticated) { // loggin in

          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var id = ObjectID(request.params.id);

          db.collection('journals').findOne({"_id": id}, function (err, results) {
            if (err) { return reply(err).code(400); }
            reply(results).code(200);
          });
          // } else {
          //   reply(result).code(400);
          // }
      //   });
      }
    }

  ]);

  next();
};

exports.register.attributes = {
  name: 'journals-api',
  version: '0.0.1'
};