Meteor.methods({
  tvmaze:function(search, type){
    check(search, String);
    check(type, String);

    var searchURL = "http://api.tvmaze.com/search/shows"
    var seasonURL = "http://api.tvmaze.com/shows"
    
    try {
      var response = HTTP.call("GET", searchURL, {params: {q: search}});
        var searchResults = response.data;
    } 
    catch (error) {
      console.log(error);
      return error.status_message;
    }

    var results = [];
		for (var i in searchResults) {
			if (searchResults.hasOwnProperty(i)) {
	                        			
				var s = searchResults[i].show;
				var id = s.id || 0;
				var title = s.name || name || "Unknown";
				var release_date = s.premiered || 0;
				var year = (release_date != 0) ? release_date.slice(0,4) : 0;
				var overview = s.summary.replace(/<(?:.|\n)*?>/gm, '') || "No overview.";
				overview = (overview.length > 250) ? overview.slice(0,250) + "..." : overview;
				
				if (s.image !== null) {
					var poster_path = s.image.medium || s.image.original || "/";
				}
				
				var link = s.url || "https://www.tvmaze.com/" + id + "/" + title;
				var media_type = type || "undefined";
				var index = i;
				if (s.externals.thetvdb) {var tvdb = s.externals.thetvdb} else { var tvdb = undefined };
				if (poster_path !== null && poster_path !== undefined)  {
					var s_poster_path = poster_path.replace("http", "https");
				} else {
					var s_poster_path = "/";
				}
				if (tvdb !== undefined){
				var seasonSearch = HTTP.call("GET", seasonURL + "/" + id + "/seasons", {});
                var seasonList = seasonSearch.data;
                    
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
                  "seasons": seasonList
				});

				}
			}
		}
    return results
 }
});
