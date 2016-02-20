module.exports = function(request, callback) {
  var db = request.server.plugins['hapi-mongodb'].db;
  var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
  var session = request.yar.get('journal_session');

  if (!session) {
    return callback({ "authenticated": false, "message": "Unauthorized" });
  }

  db.collection('sessions').findOne({ "session_id": session.session_id }, function(err, result) {
    if (err) { return reply(err).code(400); }

    if (result === null) {
      return callback({
        "authenticated": false,
        "message": "Unauthorized"
      });
    } else {
      db.collection('users').findOne({'_id': ObjectID(result.user_id)}, function (err, user) {
        if (err) { return reply(err).code(500); }

        return callback({
          "authenticated": true,
          "CurrentUser": user,
          "message": "Authorized"
        });
      });
    }
  });
};