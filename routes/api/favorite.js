var Joi   = require('joi');
var Authenticated = require("../modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    {
      method: 'PUT',
      path: '/api/journals/favorite/{id}',
      handler: function (request, reply) {
        console.log(request);
        Authenticated(request, function (result) {
          if (result.authenticated) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
            var journal_id = ObjectID(request.params.id);
            var user_id = ObjectID(result.currentUser._id);

            db.collection('users').findOne({"_id": user_id, "favoritesList": {$in: [journal_id]} }, function (err, user){
              if (err) { return reply(err).code(400); }

              if (user === null) {
                var favoritesList = user.favoritesList || []
                favoritesList.push(journal_id);

                db.collection('users').update({"_id": user_id}, {$set: {"favoritesList": favoritesList} }, function (err, user) {
                  if (err) { return reply(err).code(400); }

                  db.collection('journals').update( {"_id": journal_id}, { $inc: { "favorite": 1 }}, function (err, journal) {
                    if (err) { return reply(err).code(400); }

                    reply(journal).code(200);
                  });

                  db.collection('users').update( {"_id": journal_id}, { $inc: { "favorite": 1 }}, function (err, user) {
                    if (err) { return reply(err).code(400); }

                    reply(user).code(200);
                  });

                });
              } else {
                reply({message: "You already liked this journal!"});
              }
            })

          } else {
            reply(result).code(400);
          }

        });
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'favorite-api',
  version: '0.0.1'
};