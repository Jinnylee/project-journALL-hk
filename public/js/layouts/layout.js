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
          window.location.href = "/journals";
        },
        error: function (response) {
          var text = response.responseJSON ? response.responseJSON.message : response.responseText;
          $('#signup-form-message').text(text);
        }
      });

    });
  };

  var bindSignin = function () {
    $('#signin').on('submit', function () {
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
          window.location.href = "/journals";
        },
        error: function (response) {
          var text = response.responseJSON ? response.responseJSON.message : response.responseText;
          $('#signin-form-message').text(text);
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
          window.location.href = '/journals';
        }
      });
    });
  };

  var init = function () {
    bindSignin();
    bindSignup();
    bindSignout();
  };

  init();
});