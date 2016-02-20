var Joi    = require('joi');
var Authenticated = require("../modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/api/{username}',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;

        var username = encodeURIComponent(request.params.username);

        db.collection('users').findOne({ "username": username }, function(err, user) {
          if (err) { return reply('Internal MongoDB error', err).code(400); }

          reply(user).code(200);
        });
      }
    },
    {
      method: 'POST',
      path: '/api/addpost',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          if (result.authenticated){
            var db       = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
            var session  = request.yar.get('journal_session');
            var journal  = request.payload;
            console.log(journal);


            var newJournal = {
              "user_id": ObjectID(session.user_id),
              "title": journal.title,
              // "username": ObjectID.username,
              // "date": ISODate(),
              "journal": journal.journal,
              "favorite": 0,
              "tags": journal.tags
            };

            console.log(newJournal);

            db.collection('journals').insert(newJournal, function(err, doc) {
              if (err) { return reply ('Internal MongoDB error',err).code(400);}

              reply(doc).code(200);
            })
          } else {
            // can't create a post if you are not logged in
            reply(result).code(400);
          }
        })
      }
    }

  ]);

  next();
};

exports.register.attributes = {
  name: 'profile-api',
  version: '0.0.1'
};