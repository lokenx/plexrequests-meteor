TMDBSearch = {
  api: "14e1a56e4d03b85e51b78fcfd6e055ec",
  language: "en"
};

Meteor.methods({
  TMDBSearch:function(search, type){
    check(search, String);
    check(type, String);
    check(TMDBSearch.api, String);
    check(TMDBSearch.language, String);

    try {
      var response = HTTP.call("GET", "https://api.themoviedb.org/3/search/" + type + "?api_key=" + TMDBSearch.api + "&language=" + TMDBSearch.language + "&query=" + search, {});
    }
    catch (error) {
      console.log(error);
      return error.status_message;
    }

    var results = [];
    var quantity = response.data.results.length < 15 ? response.data.results.length : 15;

    if (response.data.total_results > 0) {
      for (i = 0; i < quantity; i++) {
        var id = response.data.results[i].id || 0;
        var title = response.data.results[i].title || response.data.results[i].name || "Unknown";
        var release_date = response.data.results[i].release_date || response.data.results[i].first_air_date || 0;
        var year = (release_date != 0) ? release_date.slice(0,4) : 0;
        var overview = response.data.results[i].overview || "No overview found.";
        overview = (overview.length > 250) ? overview.slice(0,250) + "..." : overview;
        var poster_path = response.data.results[i].poster_path || "";
        var link = "https://www.themoviedb.org/" + type + '/' + id;
        var media_type = type;
        var index = i;
        var number_of_episodes = response.data.results[i].number_of_episodes || 0;

        results.push({
          "id": id,
          "title": title,
          "year": year,
          "release_date": release_date,
          "overview": overview,
          "poster_path": poster_path,
          "link": link,
          "media_type": media_type,
          "index": index,
          "number_of_episodes": number_of_episodes
        });
      }
    }
    return results
  },

  movie:function(id, type){
    //Old ones are strings, new ones are numbers so removing check
    check(TMDBSearch.api, String);
    check(TMDBSearch.language, String);

    try {
      var response = HTTP.call("GET", "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + TMDBSearch.api, {timeout: 4000} );
    }
    catch (error) {
      console.log(error);
      return false;
    }

    return response.data.poster_path
  },

  externalIds:function(id, type){
    check(TMDBSearch.api, String);
    check(TMDBSearch.language, String);

    try {
        var response = HTTP.call("GET", "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + TMDBSearch.api, {timeout: 4000} );
    } catch (error) {
        console.log(error);
        throw new Meteor.Error(503, id);
        throw new Meteor.Error(503, "Unabled to get external ids");
    }
    
     if (response.data.imdb_id) {
        return response.data.imdb_id;
    } else {
        throw new Meteor.Error(503, "Unabled to get external ids");
    }
  }
});


TMDBSearch.externalIds = function(id, type) {
  return Meteor.call("externalIds", id, type, {}
)};
