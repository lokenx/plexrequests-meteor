Meteor.methods({
  tvmaze:function(search, type){
    check(search, String);
    check(type, String);

    var searchURL = "http://api.tvmaze.com/search/shows";

    try {
      var response = HTTP.get(searchURL, {params: {q: search}});
      var searchResults = JSON.parse(response.content);
    }
    catch (error) {
      console.log(error);
      return error.status_message;
    }

    var results = [];
    for (var i in searchResults) {

        if (searchResults.hasOwnProperty(i)) {

          var s = searchResults[i].show;

          // Moved the tvdb check to the top, should break immediately if no tvdbID exists.
          if (s.externals.thetvdb == null) {
              break;
          }

          var tvdb = s.externals.thetvdb;

          var id = s.id || 0;
          var title = s.name || name || "Unknown";
          var release_date = s.premiered || 0;
          var year = (release_date != 0) ? release_date.slice(0, 4) : 0;
          var overview = s.summary.replace(/<(?:.|\n)*?>/gm, '') || "No overview.";
          overview = (overview.length > 250) ? overview.slice(0, 250) + "..." : overview;
          var link = s.url || "https://www.tvmaze.com/" + id + "/" + title;
          var media_type = type || "undefined";
          var index = i;

          if (s.image !== null) {
              var poster_path = s.image.medium || s.image.original || "/";
          }

          if (poster_path !== null && poster_path !== undefined) {
              var s_poster_path = poster_path.replace("http", "https");
          } else {
              s_poster_path = "/";
          }

          // var seasonSearch = HTTP.get(seasonURL + "/" + id + "/seasons", {});
          // var seasonList = seasonSearch.data;

          results.push({
              "id": id,
              "tvdb": tvdb,
              "title": title,
              "year": year,
              "release_date": release_date,
              "overview": overview,
              "poster_path": s_poster_path,
              "link": link,
              "media_type": media_type,
              "index": index,
              "seasons": null
          });
        }
    }
    return results
  },

  /*
   New function to get season info for a show, moved this out of the main search function as it
   didn't need to be called for every search result. This may change when granular season
   selection gets implemented but either way it should be it's own function call.
  */
  tvseasons:function(id){
      var seasonSearch = HTTP.get("http://api.tvmaze.com/shows" + "/" + id + "/seasons", {});
      return seasonSearch.data;
  }
});
