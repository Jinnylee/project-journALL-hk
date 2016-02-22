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
        Authenticated(request, function (result) {
        if (result.authenticated) { // loggin in

          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var id = ObjectID(request.params.id);

          db.collection('journals').findOne({"_id": id}, function (err, results) {
            if (err) { return reply(err).code(400); }
            reply(results).code(200);
          });
          } else {
            reply(result).code(400);
          }
        });
      }
    },
    {
      method: 'POST',
      path: '/api/journals',
      handler: function(request, reply) {
        console.log(request);
        Authenticated(request, function (result) {
          if (result.authenticated){
            //connecting with server
            var db       = request.server.plugins['hapi-mongodb'].db;
            //
            var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
            //
            var session  = request.yar.get('journal_session');
            //getting data journal from ajax
            var journal  = request.payload;
            var journalTags = journal.tags;
            var array = journalTags.split(',');

            var newJournal = {
              "user_id": ObjectID(session.user_id),
              "title": journal.title,
              "username": session.username,
              "date": new Date(),
              "journal": journal.journal,
              "favorite": 0,
              "tags": array
            };

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
    },
    // show all the searches
    {
      method: 'GET',
      path: '/api/journals/searches',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          if (result.authenticated){

            var db = request.server.plugins['hapi-mongodb'].db;
            var searches = request.payload;
            // var searches = searchTags.split(',');
            console.log(request);

            db.collection('journals').find({tags: { $in: searches}}, function (err, doc) {
              if (err) { return reply ('Internal MongoDB error', err).code(400);}

              reply(doc).code(200);
            });

        } else{
          reply(result).code(400);
        }
        })
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'journals-api',
  version: '0.0.1'
};