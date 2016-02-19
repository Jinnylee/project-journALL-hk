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

          db.collection('journals').find().limit(10).toArray(function(err, journals){
            var data = result; // need to have authenticated inorder to show signout button
            data.journals = journals;

            reply.view('static_pages/home', data).code(200);
          })
        });
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-views',
  version: '0.0.1'
};

