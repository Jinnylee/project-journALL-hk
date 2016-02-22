var Authenticated = require("../modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    //show journals on  main page
    {
      method: 'GET',
      path: '/api/journals',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;

          //find 6 most recent journals
        db.collection('journals').find().sort({date: -1}).limit(6).toArray(function (err, results) {
          if (err) { return reply(err).code(400); }
          reply(results).code(200);
        });
          //.limit(6).sort({ date: -1 })

      }
    },
    // showing content in modal of one post
    {
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
    //create a post
    {
      method: 'POST',
      path: '/api/journals',
      handler: function(request, reply) {
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
            var array = journalTags.split(',').map(function(word) { return word.trim(); });
            console.log(array);

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
              console.log(doc)
              reply(doc).code(200);
            });
          } else {
            // can't create a post if you are not logged in
            reply(result).code(400);
          }
        });
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
            var searches = request.query.tags.split(',');
            var arraysearch = searches.map(function(word) { return word.trim(); });

            db.collection('journals').find({tags: { $all: arraysearch}}).sort({date: -1}).limit(12).toArray(function (err, doc) {
              if (err) { return reply ('Internal MongoDB error', err).code(400);}
              console.log(doc);
              reply(doc).code(200);
            });

        } else{
          reply(result).code(400);
        }
        });
      }
    },
    //show journals on profile page
    {
      method: 'GET',
      path: '/api/profile/{username}',
      handler: function (request, reply) {
        console.log(request);
        Authenticated(request, function (result) {
          if (result.authenticated){
            var db = request.server.plugins['hapi-mongodb'].db;
            var username = encodeURIComponent(request.params.username);
            db.collection('journals').find({"username": username}).sort({date: -1}).limit(6).toArray(function(err, doc) {
          if (err) { return reply ('Internal MongoDB error', err).code(400);}
            reply(doc).code(200);
          });
        } else{
          reply (result).code(400);
        }
        });
      }
    },
    //show content in modal of one post
    {
      method: 'GET',
      path: '/api/profile/{username}/journals/{id}',
      handler: function (request, reply) {
        console.log(request, "connected!");
        Authenticated(request, function(result) {
          if (result.authenticated) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
            var id = ObjectID(request.params.id);
            var username = encodeURIComponent(request.params.username);
            console.log(id);

            db.collection('journals').findOne({"_id": id}, function (err, results) {
              if (err) { return reply(err).code(400); }
              reply(results).code(200);
            });


          } else {
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