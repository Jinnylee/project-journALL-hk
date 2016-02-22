var Authenticated = require("./modules/Authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    { // serving static files
      method: 'GET',
      path: "/public/{path*}",
      handler: {
        directory: {
          path: 'public'
        }
      }
    },
    { // Home Page
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
            var data = result; // need to have authenticated inorder to show signout button
            reply.view('home', data).code(200);
          });
      }
    },
    {
      method: 'GET',
      path: '/profile/{username}',
      handler: function (request, reply) {
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var username = encodeURIComponent(request.params.username);

          db.collection('users').findOne({"username": username},
            function (err, user) {
              if (err) { return reply('Internal MongoDB error', err).code(400); }

              db.collection('journals').find({"username": username}).limit(6).toArray(function (err, journals) {
                if (err) { return reply ('Internal MongoDB error', err).code(400);}

                result['journals'] = journals;
                result['user'] = user;
                reply.view('profile', result).code(200);
              });
            }
          )
        });
      }
    }
    // ,
    // { //profile page
    //   method: 'GET',
    //   path: '/profile/{username}',
    //   handler: function(request, reply) {
    //     Authenticated(request, function (result) {
    //       var db = request.server.plugins['hapi-mongodb'].db;
    //         var data = result; // need to have authenticated inorder to show signout button
    //         reply.view('profile', data).code(200);


    //       });
    //   }
    //  }
  ]);

  next();
};

exports.register.attributes = {
  name: 'pages-views',
  version: '0.0.1'
};

