$(document).ready(function () {

  var appendPopularJournals = function (title, username, date, journal, favorite) {
    var divs =
    '<div class="entries col-xs-4">' +
      '<div id="title">' + title + '</div>' +
      '<div id="username">' + username + '</div>' +
      '<div id="date">' + date + '</div>'+
      '<div id="journal">' + journal + '</div>' +
      '<div id="favorite"><i class="fa fa-heart-o"></i>' + ' ' + favorite + '</div>' +
      '<button class ="btn btn-default" data-toggle="modal" data-target="#viewPost">' + 'View' + '</a>'
    '</div><br>';

    $('#mostPopular').append(divs);
  };

  //show recent journals
  // var showRecent = function (elem) {
  // };

  //show 6 most popular journals
  var showPopular = function (elem) {

    $.ajax({
        url: "/api/journals",
        method: "GET",
        success: function (response, status) {
          console.log(response);
          response.forEach(function(elem, index){
            appendPopularJournals(elem.title, elem.username, elem.date, elem.journal, elem.favorite);
          })
        },
        error: function (response, status) {
          console.log(response);
        }
      });

  };

  var showOnePost = function (elem) {

    //$.ajax({})

  }

  var init = function () {
    showPopular();
  };

  init();

});