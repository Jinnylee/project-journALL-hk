$(document).ready(function () {

  var bindSignup = function () {
    $('#signup').on('submit', function (e) {
      e.preventDefault();
      $('#signup-form-message').text('');

      var user = {
        email   : $('#signup [name="email"]').val(),
        name    : $('#signup [name="name"]').val(),
        username: $('#signup [name="username"]').val(),
        password: $('#signup [name="password"]').val()
      };

      $.ajax({
        type: "POST",
        url: '/api/signup',
        data: user,
        success: function (response) {
          window.location.href = "/";
        },
        error: function (response) {
          var text = response.responseJSON ? response.responseJSON.message : response.responseText;
          $('#signup-form-message').text(text);
        }
      });

    });
  };

  var bindSignin = function () {
    $('#signin').on('submit', function (e) {
      e.preventDefault();

      var user = {
        username: $('#signin [name="username"]').val(),
        password: $('#signin [name="password"]').val()
      };

      $.ajax({
        type: "POST",
        url: "/api/signin",
        data: user,
        success: function (response) {
          console.log(response);
          window.location.href = "/";
        },
        error: function (response) {
          console.log(response);
        }
      });
    });
  };


  var bindSignout = function () {
    $('#signout-btn').on('click', function (e) {
      $.ajax({
        type: "DELETE",
        url: "/api/signout",
        success: function (response) {
          window.location.href = '/';
        }
      });
    });
  };

  var appendSearched = function (title, username, date, journal, favorite, id) {
    var divs =
    '<div class="entries col-xs-4">' +
      '<div id="title">' + title + '</div>' +
      '<div id="username"><a href="/profile/'+ username + '">' + username + '</a></div>' +
      '<div id="date">' + date + '</div>'+
      '<div id="journal">' + journal + '</div>' +
      '<div id="favorite"><i class="fa fa-heart-o"></i>' + ' ' + favorite + '</div>' +
      '<button class="btn btn-default view-btn" data-id="' + id + '">' + 'View' + '</a>'
    '</div><br>';

    $('#mostPopular').append(divs);
  };

  var noSearch = function () {
    var message = '<div>No matching journals</div>'
    $('#mostPopular').append(message);

  }

  var search = function () {
    $('.searchbar').on('submit', function (e) {
      e.preventDefault();

      var searchTags = $('.searchTags').val();
      // var searches = searchTags.split(',');
      console.log(searchTags)

      $.ajax({
        type: "GET",
        url: "/api/journals/searches",
        data: {
          tags: searchTags
        },
        success: function (response) {
          $('#mostPopular').empty();
          response.forEach(function(elem, index) {
            appendSearched(elem.title, elem.username, elem.date, elem.journal, elem.favorite, elem._id);
          })
        },
        error: function (response) {
          $('#mostPopular').empty();
          noSearch();
        }
      })
    })
  };

  var init = function () {
    bindSignin();
    bindSignup();
    bindSignout();
    search();
  };

  init();
});