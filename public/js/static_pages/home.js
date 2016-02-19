//db.collection('journals').find().limit(10).toArray(function(err, journals)
//data.journals = journals;

$(document).ready(function () {

  var appendPopularJournals = function () {
    var Divs =
    '<div data-id='+ id '>' +
      '<div id="title">' + title + '</div>' +
      '<div id="username">' + username + '</div>' +
      '<div id="date">' + date + '</div>'
      '<div id "journalEntry">' + journalEntry + '</div>' +
      '<div id="favorite"><i class="fa fa-heart-o"></i>' + favorite + '</div>' +
    '</div>';

    $('#mostPopular').append(Divs);
  };

  //show recent journals
  var showRecent = function (elem) {
  };

  //show 6 most popular journals
  var showPopular = function (elem) {

    $.ajax({
        url: "/api/doughnuts",
        method: "POST",
        data: {
          title: ,
          username: ,
          date: ,
          journal: ,
          favorite:
        },
        success: function (response.forEach, status) {
          appendPopularJournals(response.title, response.username, response.date, response.journal, response.favorite);
          bindButtons();
        },
        error: function (response, status) {
          console.log(response);
        }
      });

  };

});