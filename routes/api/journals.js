var Authenticated = require("../modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    //show journals on  main page: recent
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
    //show popular posts on main page
    {
      method:'GET',
      path: '/api/journals/popular',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;

        db.collection('journals').find().sort({favorite: -1}).limit(4).toArray(function (err, results) {
          if (err) { return reply(err).code(400); }
          reply(results).code(200);
        });

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
              if (err) { return reply (err).code(400);}

              db.collection('users').findOneAndUpdate({"_id":newJournal.user_id}, {$inc: {"entries":1}}, function (err, journal) {
                if (err) {return reply(err).code(400); }

                reply(doc).code(200);
              });

            });
          } else {
            // can't create a post if you are not logged in
            reply(result).code(400);
          }
        });
      }
    },
    // edit a post
    {
      method: 'PUT',
      path: '/api/journals/{id}',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          if (result.authenticated) {
            var db       = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
            var session  = request.yar.get('journal_session');

            var id = ObjectID(request.params.id);
            var user_id = ObjectID(session.user_id);

            var editedJournal = request.payload;
            var tags = editedJournal.tags

            var array = tags.split(',').map(function(word) { return word.trim(); });
            var updateJournal = {
              "title": editedJournal.title,
              "tags": array,
              "journal": editedJournal.journal
            }

            db.collection('journals').findOne({"_id":id}, function (err, journal) {
              if (err) { return reply(err).code(400); }

              if (journal === null) {
                return reply ({message: "There is no journal."}).code(404);
              }

              if (journal.user_id.toString() === user_id.toString()) {
                db.collection('journals').update({"_id": id}, {$set: updateJournal}, function (err, journal){
                  if (err) { return reply(err).code(400); }
                  reply(journal).code(200);
                });
              } else {
                reply({message: "This is not your journal"}).code(400);
              }
            });
          } else {
            reply (result).code(400);
          }
        });
      }
    },
    // delete a post
    {
      method: 'DELETE',
      path: '/api/journals/{id}',
      handler: function (request, reply) {
        Authenticated(request, function (result) {
          if (result.authenticated) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
            var session = request.yar.get('journal_session');

            var id = ObjectID(request.params.id);
            var user_id = ObjectID(session.user_id);

            db.collection('journals').findOne({"_id":id}, function (err, journal) {
              if(err) { return reply(err).code(400); }

              if (journal.user_id.toString() === user_id.toString()) {
                db.collection('journals').remove({'_id':id}, function (err, doc) {
                  if (err) { return reply(err).code(400); }
                  reply(doc).code(200);
                });
              } else {
                reply ({message: "This is not your journal."}).code(400);
              }
            });
          } else {
            reply(result).code(400);
          }
        //Authenticated
        })
      }
    },
    // show all the searches
    {
      method: 'GET',
      path: '/api/journals/searches',
      handler: function(request, reply) {
        console.log(request);
        Authenticated(request, function (result) {
          if (result.authenticated){

            var db = request.server.plugins['hapi-mongodb'].db;
            var searches = request.query.tags;
            var arraysearch = searches.trim().replace(/\s/, '').split(',');
            console.log(arraysearch)

            db.collection('journals').find({tags: { $all: arraysearch}}).sort({date: -1}).limit(12).toArray(function (err, journals) {

              console.log(journals);
              if (err) { return reply ('Internal MongoDB error', err).code(400);}

              if (journals.length != 0) {
                reply(journals).code(200);
              } else {
                reply({message: "No journals found"}).code(400);
              }
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
    },
    //get favorite on profile page
    {
      method: 'GET',
      path:'/api/profile/{username}/favorite',
      handler: function (request, reply) {
        Authenticated(request, function (result) {
          if (result.authenticated) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var username = encodeURIComponent(request.params.username);

            db.collection('users').findOne({"username": username}, function (err, user) {
              if (err) {return reply ('Internal MongoDB error', err).code(400);}

              db.collection('journals').find({ "_id": {$in: user.favoritesList} }).toArray(function (err, journals) {
                if (err) { return reply ('Internal MongoDB error', err).code(400);}

                reply(journals).code(200);
              })
            })
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