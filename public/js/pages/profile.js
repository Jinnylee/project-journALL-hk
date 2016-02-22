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

  // var showOwnEntries = function () {

  // };

  var init = function () {
    bindCreateJournal();
    //bindTwoButtons();
    showOnePostProfile();
    closeOnePostProfile
  }

  init();

});