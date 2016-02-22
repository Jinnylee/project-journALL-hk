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

      $.ajax({
        method: 'POST',
        url: '/api/journals',
        data: journal,
        success: function (response) {
          console.log(response)
          $('#create-modal').modal('hide');
        },
        error: function (response) {
          console.log("no post to add", response);
        }
      });

    })
  };

  var showOnePostProfile = function () {
    $('.view-btn').off().on('click', function (e) {
      e.preventDefault();

      $('#viewPost').modal(show);
    })
  };

  var closeOnePostProfile = function () {
    $('closeOne').off().on('click', function (e){
      e.preventDefault();

      $('#viewPost').modal(hide);
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
      '<button class="btn btn-default view-btn" data-id="' + id + '">' + 'View' + '</a>'
    '</div><br>';

    $('#userPostsFavorites').append(divs);
  }

  var showOwnEntries = function () {

    var username = window.location.pathname.split('/')[2]
    console.log(username);
    $.ajax({
      url: "/api/profile/" + username,
      method: "GET",
      success: function (response, status) {
        console.log(response);
        response.forEach(function(elem, index) {
          appendOwnJournals(elem.title, elem.username, elem.date, elem.journal, elem.favorite, elem._id);
        })
      },
      error: function(response, status) {
        console.log(response);
      }
    })
  };

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
    //bindTwoButtons();
    // showOnePostProfile();
    // closeOnePostProfile();
  }

  init();

});