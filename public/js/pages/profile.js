$(document).ready(function () {

  var bindCreateJournal = function () {
    $('#createJournal').on('submit', function (e) {
      e.preventDefault();
      $('#create-form-message').text('');

      //var username = $(this).parent().data("username");

      var journal = {
        title   : $('#createJournal [name="title"]').val(),
        tags    : $('#createJournal [name="tags"]').val(),
        journal : $('#createJournal [name="journal"]').val()
      };

      console.log(journal);

      var username = window.location.pathname.split('/')[2]

      $.ajax({
        method: 'POST',
        url: '/api/journals',
        data: journal,
        success: function (response) {
          console.log(response)
          $('#create-modal').modal('hide');
          window.location.href = "/profile/" + username;
        },
        error: function (response) {
          console.log("no post to add", response);
        }
      });

    })
  };

  var appendOwnJournals = function (title, username, date, journal, favorite, id) {
    var divs =
    '<div class="entries col-xs-4">' +
      '<div id="title">' + title + '</div>' +
      '<div id="username"><a href="/profile/'+ username + '">' + username + '</a></div>' +
      '<div id="date">' + date + '</div>'+
      '<div id="journal">' + journal + '</div>' +
      '<div id="favorite"><i class="fa fa-heart-o"></i>' + ' ' + favorite + '</div>' +
      '<button class="btn btn-default userpost" data-id="' + id + '">' + 'View' + '</a>' +
    '</div><br>';

    $('#userPostsFavorites').append(divs);
  }

  var showOwnEntries = function () {

    var username = window.location.pathname.split('/')[2]
    $.ajax({
      url: "/api/profile/" + username,
      method: "GET",
      success: function (response, status) {
        response.forEach(function(elem, index) {
          appendOwnJournals(elem.title, elem.username, elem.date, elem.journal, elem.favorite, elem._id);
          console.log(elem);
        })
      },
      error: function(response, status) {
        console.log(response);
      }
    })
  };

  var appendSinglePostOwn = function (title, username, date, journal, favorite, id) {

    var title =
    '<div id="singletitle">' +
      title +
    '</div>'

    var body =
    '<div id="singlebody">' +
      '<div id="singleusername">' + username +
      '<div id="singledate">' + date +
      '<div id="singlejournal>' + journal +
      '<div id="singlefavorite>' + favorite +
    '</div>' +
    '<button type="button" class="btn btn-primary" id="like" data-id="' + id + '"><i class="fa fa-heart"></i> Favorite</button>';

    $('.body').empty();
    $('.title').empty();
    $('.body').append(body);
    $('.title').append(title);
  };

  var showOwnOneEntry = function () {
    $('.userpost').off().on('click', function(e) {
      e.preventDefault();
      console.log("Hello I am Jinny!!")

      var id = $(this).data("id");
      var username = window.location.pathname.split('/')[2]
      console.log(id);
      console.log(username);

      $.ajax({
        method: "GET",
        url: 'api/profile/' + username + '/journals/' + id,
        success: function (response) {
          console.log(response);
          // appendSinglePostOwn(response.title, response.username, response.date, response.journal, response.favorite, response._id);
          // $('#viewOnePost').modal('show');
        },
        error: function (response) {
          console.log(response);
        }
      })
    });
  }

  // var bindTwoButtons = function () {
  //   $('#userFavorites').on('click', function (e) {
  //     e.preventDefault();

  //     $('#ownFavorite').show();
  //     $('#ownPost').hide();

  //   });

  //   $('#userPost').on('click', function (e) {
  //     e.preventDefault();

  //     $('#ownFavorite').hide();
  //     $('#ownPost').show();

  //    })
  // };

  var init = function () {
    bindCreateJournal();
    showOwnEntries();
    showOwnOneEntry();
    //bindTwoButtons();
  }

  init();

});