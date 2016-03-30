Meteor.methods({
	"searchContent": function(searchterm, searchType) {
		check(searchterm, String);
		check(searchType, String);


		if (searchType !== "Music") {
			var type = (searchType === "Movies") ? "movie" : "tv";
			
			    if (type === "tv") {
		    		
                    try {
					    var result = Meteor.call("tvmaze", searchterm, type)
                    				
			        } catch (error) {
				        logger.error("tvmaze Error -> " + error.message);
				        return [];
			        
                    }
			    
                } else if (type === "movie") {
		    		
                    try {
				        var result = Meteor.call("TMDBSearch", searchterm, type)
						var tmp = result.link
						result.link = "https://image.tmdb.org/t/p/w184" + tmp;

			        } catch (error) {
				        logger.error("TMDBSearch Error -> " + error.message);
				        return [];
			        
                    }
			    }
		
            return result;
		
        } else {
			return [];
		}	
	},

	"searchOptions": function () {
		var options = [];

		if (Settings.find({}).fetch()[0].searchOptionsMOVIES) {
			options.push("Movies");
		}

		if (Settings.find({}).fetch()[0].searchOptionsTV) {
			options.push("TV Shows");
		}

		return options;
	}
});
