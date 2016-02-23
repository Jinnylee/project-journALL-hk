var Joi   = require('joi');
var Authenticated = require("../modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    {
      method: 'PUT',
      path: '/api/journals/favorite/{id}',
      handler: function (request, reply) {
        Authenticated(request, function (result) {
          if (result.authenticated) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
            var journal_id = ObjectID(request.params.id);
            var user_id = ObjectID(result.currentUser._id);

            db.collection('users').findOne({"_id": user_id, "favoritesList": {$in: [journal_id]} }, function (err, user){
              if (err) { return reply(err).code(400); }

              if (user === null) {
                var favoritesList = result.currentUser.favoritesList || []
                favoritesList.push(journal_id);

                db.collection('users').update({"_id": user_id}, {$set: {"favoritesList": favoritesList} }, function (err, user) {
                  if (err) { return reply(err).code(400); }

                  db.collection('journals').findOneAndUpdate({"_id": journal_id}, { $inc: { "favorite": 1 }}, function (err, journal) {
                    if (err) { return reply(err).code(400); }

                    var journal_user_id = journal.value.user_id;

                    db.collection('users').update( {"_id": journal_user_id}, { $inc: { "favorite": 1 }}, function (err, user) {
                      if (err) { return reply(err).code(400); }

                      // because update doesn't give you the updated one.
                      // it only gives you the document before it was updated
                      journal.value.favorite++;
                      reply(journal.value).code(200);
                    });
                  });
                });
              } else {
                reply({message: "You already liked this journal!"}).code(400);
              }
            })
          } else {
            reply(result).code(400);
          }

        });
      }
    },
    //show most popular users
    {
      method: "GET",
      path: "/api/topuser",
      handler: function (request, reply) {
            var db = request.server.plugins['hapi-mongodb'].db;

            db.collection('users').find().sort({favorite: -1}).limit(5).toArray(function (err, results) {
              if (err) { return reply(err).code(400); }
              reply(results).code(200);
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