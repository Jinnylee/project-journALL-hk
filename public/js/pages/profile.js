$(document).ready(function () {

  var bindCreateJournal = function () {
    $('#createJournal').on('submit', function (e) {
      e.preventDefault();
      $('#create-form-message').text('');

      //var username = $(this).parent().data("username");

      var journal = {
        title   : $('#createJournal [name="title"]').val(),
        tags    : $('#createJournal [name="tags"]').val(),
        journal : $('#createJournal #entryInput').val()
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
      $("#edit-form-message").text('');
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

      var username = window.location.pathname.split('/')[2]

      $.ajax({
        url: "/api/journals/" + id,
        method: "PUT",
        data: editedJournal,
        success: function (response, status) {
          console.log(response);
          $('#edit-modal').modal('hide');
          window.location.href = "/profile/" + username;
        },
        error: function (response, status) {
          console.log(response);
          $("#edit-form-message").text("This is not your journal.")
        }
      });
    });
  };

  // delete journal
  var bindDeleteJournal = function () {
    $('.deletePost').off().on('click', function (e){
      e.preventDefault();
      $('#delete-form-message').text('');

      console.log("request sent!");

      var id = $(this).data("id");
      var username = window.location.pathname.split('/')[2]

      $.ajax({
        url: '/api/journals/' + id,
        method: 'DELETE',
        success: function (response, status) {
          console.log(response);
          $('#viewOwnPost').modal('hide');
          window.location.href = "/profile/" + username;
        },
        error: function (response, status) {
          console.log(response);
          $('#delete-form-message').text('This is not your journal.')
        }
      })
    })
  }

  // append journals to page
  var appendOwnJournals = function (favorite, title, username, date, journal, id) {
    var divs =
    '<div class="entries col-xs-12 col-md-6" data-id="' + id + '">' +
    '<div class="col-xs-2"id="favorite">' +
      '<i class="fa fa-heart"></i> ' +
      '<span>' + favorite + '</span>' +
    '</div>' +
    '<div class="text col-xs-9">' +
        '<div id="title">' + title + '</div>' +
        '<div id="username"><a href="/profile/'+ username + '">' + username + '</a></div>' +
        '<div id="date">' + date + '</div>'+
        '<button class="btn btn-default userpost" data-id="' + id + '">' + 'Read' + '</a>' +
      '</div>'+
    '</div>';

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
          appendOwnJournals(elem.favorite, elem.title, elem.username, elem.date, elem.journal, elem._id);
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
      '<p><div id="singleusername">' + '<a href="/profile/' +username + '">' + username + '</a></div></p>' +
      '<p><div id="singledate">' + date + '</p>' +
      '<p><div id="singletags"> Tags: ' + tags + '</p>' +
      '<p><div id="singlefavorite"><i class="fa fa-heart"></i> ' + '<span>' + favorite + '</span>' +
      '<p><div id="singlejournal">' + journal + '</p>' +
    '</span></div></p>'

    $('.deletePost').data('id', id);
    $('.like').data('id', id);
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
      $('#delete-form-message').text('');
      $('#edit-form-message').text('');
      $('#favorite-form-message').text('');

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
  };

  // var showFavoritePosts = function () {
  //   $('#userFavorites').on('click', function (e) {
  //     e.preventDefault();
  //     console.log("request sent");

  //     $('#userPostsFavorites').empty();
  //     var username = window.location.pathname.split('/')[2];
  //     console.log(username);

  //     $.ajax({
  //       url: "/api/profile/" + username + "/favorite",
  //       method: "GET",
  //       success: function (response, status) {
  //         response.forEach(function(elem, index) {
  //           appendOwnJournals(elem.title, elem.username, elem.date, elem.journal, elem.favorite, elem._id);
  //           console.log(elem);
  //           showOwnOneEntry();

  //         })
  //       },
  //       error: function(response, status) {
  //         console.log(response);
  //       }
  //     })
  //   })

  // };

  // var showJournalonButton = function () {
  //   $('#userPosts').on('click', function (e) {
  //     e.preventDefault();
  //     console.log("request sent!");

  //     $('#userPostsFavorites').empty();
  //     var username = window.location.pathname.split('/')[2];
  //     console.log(username);

  //     $.ajax({
  //       url: "/api/profile/" + username + "/posts",
  //       method: "GET",
  //       success: function (response, status) {
  //         response.forEach(function(elem, index) {
  //           appendOwnJournals(elem.title, elem.username, elem.date, elem.journal, elem.favorite, elem._id);
  //           console.log(elem);
  //           showOwnOneEntry();
  //         })
  //       },
  //       error: function(response, status) {
  //         console.log(response);
  //       }
  //     });

  //   });
  // };

  // liking post
  var favoritePost = function () {
    $('.like').off().on('click', function (e) {
      e.preventDefault();
      $('#favorite-form-message').text('');

      var id = $(this).data("id");

      $.ajax({
        method: "PUT",
        url: "/api/journals/favorite/" + id,
        success: function (response, status) {
          console.log("added favorite!", response);
          $('#singlefavorite span').empty();
          $('#singlefavorite span').text(response.favorite);

          $('div.entries[data-id="' + response._id +'"]').find('#favorite span').empty().text(response.favorite);

          $('#favorite-form-message').text('Liked!');

        },
        error: function (response, status) {
          console.log("can't add favorite! ", response);
          $('#favorite-form-message').text("Looks like you've already liked this post!");
        }
      });

    })
  };

  var init = function () {
    bindCreateJournal();
    openEditModal();
    bindEditJournal();
    bindDeleteJournal();
    showOwnEntries();
    favoritePost();
    // showFavoritePosts();
    // showJournalonButton();
    //bindTwoButtons();
  }

  init();

});