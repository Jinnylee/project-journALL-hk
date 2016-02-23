$(document).ready(function () {

  var appendPopularJournals = function (title, username, date, favorite, id) {
    var divs =
    '<div class="entries col-xs-4">' +
      '<div id="title">' + title + '</div>' +
      '<div id="username"><a href="/profile/'+ username + '">' + username + '</a></div>' +
      '<div id="date">' + date + '</div>'+
      '<div id="favorite"><i class="fa fa-heart-o"></i>' + ' ' + favorite + '</div>' +
      '<button class="btn btn-default view-btn" data-id="' + id + '">' + 'Read' + '</a>' +
    '</div><br>';

    $('.mainarea').append(divs);
  };

  // populating modal
  var appendSinglePost = function (title, username, date, journal, favorite, id) {
    var title =
    '<div id="singletitle">' +
      title +
    '</div>'

    var body =
    '<div id="singlebody">' +
      '<div id="singleusername">' + username + '</div>' +
      '<div id="singledate">' + date + '</div>' +
      '<div id="singlejournal">' + journal + '</div>' +
      '<div id="singlefavorite">' + favorite + '</div>' +
    '</div>'

    $('#like').data('id', id);
    $('.oneBody').empty();
    $('.oneTitle').empty();
    $('.oneBody').append(body);
    $('.oneTitle').append(title);
  };

  //show recent journals
  // var showRecent = function (elem) {
  // };

  //show 6 most popular journals
  var showPopular = function () {
    $.ajax({
      url: "/api/journals",
      method: "GET",
      success: function (response, status) {
        console.log(response);
        response.forEach(function(elem, index){
          appendPopularJournals(elem.title, elem.username, elem.date, elem.favorite, elem._id);
        })
        showOnePost();
      },
      error: function (response, status) {
        console.log(response);
      }
    });
  };

  // Retrieving info to populate modal
  var showOnePost = function () {
    $('.view-btn').off().on('click', function (e) {
      e.preventDefault();

      var id = $(this).data("id");
      console.log(id);

      $.ajax({
        method: "GET",
        url: '/api/journals/' + id,
        success: function (response) {
          console.log(response.journal);
          appendSinglePost(response.title, response.username, response.date, response.journal, response.favorite, response._id);
          $('#viewPost').modal('show');
        },
        error: function (response) {
          console.log("Please Log in first", response);
        }
      })
    })
  };

  // linking post
  var favoritePost = function () {
    $('#like').off().on('click', function (e) {
      e.preventDefault();
      console.log("Sent request!")

      var id = $(this).data("id");
      console.log(id);

      $.ajax({
        method: "PUT",
        url: "/api/journals/favorite/" + id,
        success: function (response, status) {
          console.log("added favorite!", response);

        },
        error: function (response, status) {
          console.log("can't add favorite! ", response);
        }
      });

    })
  };

  var init = function () {
    showPopular();
    favoritePost();
  };

  init();

});