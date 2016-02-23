$(document).ready(function () {

  var appendSearchJournals = function (title, username, date, favorite, id) {
    var divs =
    '<div class="entries col-xs-4" data-id="' + id + '">' +
      '<div id="title">' + title + '</div>' +
      '<div id="username"><a href="/profile/'+ username + '">' + username + '</a></div>' +
      '<div id="date">' + date + '</div>'+
      '<div id="favorite">' +
        '<i class="fa fa-heart"></i> ' +
        '<span>' + favorite + '</span>' +
      '</div>' +
      '<button class="btn btn-default view-btn" data-id="' + id + '">' + 'Read' + '</a>' +
    '</div>';

    $('.mainarea').append(divs);
  };

//actually recent journals
  var appendPopularJournals = function (title, username, date, favorite, id) {
    var divs =
    '<div class="entries col-xs-4" data-id="' + id + '">' +
      '<div id="title">' + title + '</div>' +
      '<div id="username"><a href="/profile/'+ username + '">' + username + '</a></div>' +
      '<div id="date">' + date + '</div>'+
      '<div id="favorite">' +
        '<i class="fa fa-heart"></i> ' +
        '<span>' + favorite + '</span>' +
      '</div>' +
      '<button class="btn btn-default view-btn" data-id="' + id + '">' + 'Read' + '</a>' +
    '</div>';

    $('.recentArea').append(divs);
  };

//actually popular journals
  var appendRecentJournals = function (title, username, date, favorite, id) {
    var divs =
    '<div class="entries col-xs-6" data-id="' + id + '">' +
      '<div id="title">' + title + '</div>' +
      '<div id="username"><a href="/profile/'+ username + '">' + username + '</a></div>' +
      '<div id="date">' + date + '</div>'+
      '<div id="favorite">' +
        '<i class="fa fa-heart"></i> ' +
        '<span>' + favorite + '</span>' +
      '</div>' +
      '<button class="btn btn-default view-btn" data-id="' + id + '">' + 'Read' + '</a>' +
    '</div>'

    $('.popularArea').append(divs);
  };

//ACTUALLY showing 4 popular
  var showRecent = function () {
    $.ajax({
      url: "/api/journals/popular",
      method: "GET",
      success: function (response,status) {
        response.forEach(function(elem, index) {
          appendRecentJournals(elem.title, elem.username, elem.date, elem.favorite, elem._id);
        })
        showOnePost();
      },
      error: function (response, status) {
        console.log(response);
      }
    })
  }

  // populating modal
  var appendSinglePost = function (title, username, date, tags, journal, favorite, id) {
    var title =
    '<div id="singletitle">' +
      title +
    '</div>'

    var body =
    '<div id="singlebody">' +
      '<div id="singleusername">' + username + '</div>' +
      '<div id="singledate">' + date + '</div>' +
      '<div id="singledate">' + tags + '</div>' +
      '<div id="singlejournal">Tags: ' + journal + '</div>' +
      '<div id="singlefavorite"><i class="fa fa-heart"></i> ' +  '<span>' + favorite + '<span>' + '</div>' +
    '</div>'

    $('#like').data('id', id);
    $('.oneBody').empty();
    $('.oneTitle').empty();
    $('.oneBody').append(body);
    $('.oneTitle').append(title);
  };

  //ACTUALLy- showing 6 most recent
  var showPopular = function () {
    $.ajax({
      url: "/api/journals",
      method: "GET",
      success: function (response, status) {
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

  var noSearch = function () {
    var message = '<div>No matching journals</div>'
    $('.mainarea').append(message);
  };

  var showSearch = function (searchTags) {
    var decodedSearch = decodeURIComponent(searchTags);
    var keywordsStr = decodedSearch.split('=')[1];
    console.log("request sent!")

    $.ajax({
      type: "GET",
      url: "/api/journals/searches",
      data: {
        tags: keywordsStr
      },
      success: function (response) {
        $('.mainarea').empty();
        response.forEach(function(elem, index) {
          appendSearchJournals(elem.title, elem.username, elem.date, elem.favorite, elem._id);
        })
        showOnePost();
      },
      error: function (response) {
        console.log(response);
        $('.mainarea').empty();
        noSearch();
      }
    })
  }

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
          appendSinglePost(response.title, response.username, response.date, response.tags, response.journal, response.favorite, response._id);
          $('#viewPost').modal('show');
        },
        error: function (response) {
          console.log("Please Log in first", response);
        }
      })
    })
  };

  // liking post
  var favoritePost = function () {
    $('#like').off().on('click', function (e) {
      e.preventDefault();

      var id = $(this).data("id");

      $.ajax({
        method: "PUT",
        url: "/api/journals/favorite/" + id,
        success: function (response, status) {
          console.log("added favorite!", response);
          $('#singlefavorite span').empty();
          $('#singlefavorite span').text(response.favorite);

          $('div.entries[data-id="' + response._id +'"]').find('#favorite span').empty().text(response.favorite);
        },
        error: function (response, status) {
          console.log("can't add favorite! ", response);
        }
      });

    })
  };

  var topuserlist = function (username, favorite, entries) {
    var list =
    '<div class="users">' +
      '<div class="topusername">' + username + '</div>' +
      '<div class="topfavorite"><i class="fa fa-heart"></i> ' + favorite + '</div>' +
      '<div class="topentries">' + entries + '</div>' +
    '</div>'

    $('.popularUser').append(list);
  }


  var topUser = function () {

    $.ajax({
      method: "GET",
      url: "/api/topuser",
      success: function (response, status) {
        console.log(response);
        response.forEach(function(elem, index) {
          topuserlist(elem.username, elem.favorite, elem.entries);
        })
      },
      error: function (response, status) {
        console.log(response);
      }
    })
  };

  var gotoUser = function () {
    $('.users').on('click', function (e) {
      e.preventDefault();

    })
  };

  var init = function () {
    topUser();
    var search = window.location.search;
    if (search) {
      $("#page-title").text("Matching Journals");
      showSearch(search);
    } else {
      $("#page-title").text("JournALL");
      showPopular();
      showRecent();
      //gotoUser();
    }
    favoritePost();
  };

  init();

});