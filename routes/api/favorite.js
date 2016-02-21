var Joi   = require('joi');
var Authenticated = require("../modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    // {
    //   method: 'PUT',
    //   path: '/api/journals/{id}',
    //   handler: function (request, reply) {
    //     Authenticated(request, function (result) {
    //       console.log(request);
    //       var db = request.server.plugins['hapi-mongodb'].db;
    //       var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
    //       var id = ObjectID(request.params.id);
          // if (result.authenticated) {
          //   var db       = request.server.plugins['hapi-mongodb'].db;
          //   var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          //   var session  = request.yar.get('hapi_doughnuts_session');

          //   db.collection('journals').update( {"_id": id}, { $inc: { "favorite": 1 }}, function (err, doughnut) {
          //         if (err) { return reply(err).code(400); }
          //         reply(journal).code(200);
          //   });

          // db.collection('journals').find({_id: id},{user_id:1,_id:0} function (err, results) {
          //   if (err) { return reply(err).code(400); }
          //   reply(results).code(200);
          // });

          // db.collection('users').update( {"_id": id}, { $inc: { "favorite": 1 }}, function (err, doughnut) {
          //   if (err) { return reply(err).code(400); }
          //   reply(journal).code(200);
          // });

          // } else {
          //   reply(result).code(400);
          // }

        // });
    //   }
    // }

  ]);
};

exports.register.attributes = {
  name: 'favorite-api',
  version: '0.0.1'
};