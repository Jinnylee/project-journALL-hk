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
        },
        error: function (response) {
          console.log("no post to add", response);
        }
      });

    })
  };

  var bindTwoButtons = function () {
    $('#userFavorites').on('click')
  };

  var init = function () {
    bindCreateJournal();
    bindTwoButtons
  }

  init();

});