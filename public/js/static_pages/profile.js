$(document).ready(function () {

  var showInformation = function (username, favorite) {
    var info =
    '<div class="entries col-xs-4">' +
      '<div id="username">' + username + '</div>' +
      '<div id="favorite"><i class="fa fa-heart-o"></i>' + ' ' + favorite + '</div>' +
    '</div>';

    $('#userInformation').append(info)

  }

  var getInformation = function () {
    //not working
    $.ajax({
        url: "/api/{username}",
        method: "GET",
        success: function (response, status) {
          console.log(response);
          showInformation(response.username, response.favorite);

        },
        error: function (response, status) {
          console.log(response);
        }
      });
  }

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
        },
        error: function (response) {
          console.log("no post to add", response);
        }
      });

    })
  };


  var init = function () {
    showInformation();
    bindCreateJournal();
  }

  init();

});