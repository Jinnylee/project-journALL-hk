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

    $.ajax({
        url: "/api/{username}",
        method: "GET",
        success: function (response, status) {
          console.log(response);
          showInformation(response.username, elem.favorite);

          getInformation();
        },
        error: function (response, status) {
          console.log(response);
        }
      });
  }

  var init = function () {
    showInformation();
  }

  init();

});