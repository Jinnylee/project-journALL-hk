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

  var openEditModal = function () {
    $('.editPost').off().on('click', function (e) {
      e.preventDefault();
      $('#edit-modal').modal('show');
      $('#viewOwnPost').modal('hide');
    })
  };

  // bind button on modal to edit journal
  var bindEditJournal = function () {
    $('#editJournal').on("submit", function (e) {
      e.preventDefault();
      console.log("request sent");

      var id = $(this).data("id");
      var editedJournal = {
        title: $('#edit-title').val(),
        tags: $('#edit-tags').val(),
        journal: $('#edit-journal').val(),
      };

      $.ajax({
        url: "/api/journals/" + id,
        method: "PUT",
        data: editedJournal,
        success: function (response, status) {
          console.log(response);
        },
        error: function (response, status) {
          console.log(response);
        }
      });
    });
  };

  // bind button on modal to delete journal
  var bindDeleteJournal = function () {
    $('#deletePost').on('submit', function (e){
      e.preventDefault();
      console.log("request sent!");

      var id = $(this).data("id");
    })
  }

  // append journals to page
  var appendOwnJournals = function (title, username, date, journal, favorite, id) {
    var divs =
    '<span><div class="entries col-xs-4">' +
      '<div id="title">' + title + '</div>' +
      '<div id="username"><a href="/profile/'+ username + '">' + username + '</a></div>' +
      '<div id="date">' + date + '</div>'+
      '<div id="journal">' + journal + '</div>' +
      '<div id="favorite"><i class="fa fa-heart-o"></i>' + ' ' + favorite + '</div>' +
      '<button class="btn btn-default userpost" data-id="' + id + '">' + 'View' + '</a>' +
    '</div><span>';

    $('#userPostsFavorites').append(divs);
  }

  // get all journals
  var showOwnEntries = function () {
    var username = window.location.pathname.split('/')[2]
    $.ajax({
      url: "/api/profile/" + username,
      method: "GET",
      success: function (response, status) {
        response.forEach(function(elem, index) {
          appendOwnJournals(elem.title, elem.username, elem.date, elem.journal, elem.favorite, elem._id);
          console.log(elem);
          showOwnOneEntry();
        })
      },
      error: function(response, status) {
        console.log(response);
      }
    })
  };

  // append content to modal
  var appendSinglePostOwn = function (title, username, date, tags, journal, favorite, id) {
    var header =
    '<div id="singletitle">' +
      title +
    '</div>'

    var body =
    '<div id="singlebody">' +
      '<div id="singleusername">' + username +
      '<div id="singledate">' + date +
      '<div id="singletags"> Tags:' + tags +
      '<div id="singlejournal>' + journal +
      '<div id="singlefavorite>' + favorite +
    '</div>' +
    '<button type="button" class="btn btn-primary" id="like" data-id="' + id + '"><i class="fa fa-heart"></i> Favorite</button>'

    $('#editJournal').data('id', id);
    $('#edit-title').val(title);
    $('#edit-tags').val(title);
    $('#edit-journal').val(journal);

    $('.body').empty();
    $('.title').empty();
    $('.body').append(body);
    $('.title').append(header);
  };

  // when button view is clicked
  var showOwnOneEntry = function () {
    $('.userpost').off().on('click', function(e) {
      e.preventDefault();
      console.log("Hello I am Jinny!!")

      var id = $(this).data("id");
      var username = window.location.pathname.split('/')[2]

      $.ajax({
        method: "GET",
        url: '/api/profile/' + username + '/journals/' + id,
        success: function (response) {
          console.log(response);
          $('#viewOwnPost').modal('show');
          appendSinglePostOwn(response.title, response.username, response.date, response.tags, response.journal, response.favorite, response._id);
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
    openEditModal();
    bindEditJournal();
    bindDeleteJournal()
    showOwnEntries();
    //bindTwoButtons();
  }

  init();

});