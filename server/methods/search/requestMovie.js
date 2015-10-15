Meteor.methods({
	"requestMovie": function(request) {
		check(request, Object);

		// Movie Request only requires IMDB_ID
		//Get IMDB ID
		try {
			var imdb = TMDBSearch.externalIds(request.id, "movie");
		} catch (error) {
			console.log("Error getting IMDB ID:", error.message);
			return false;
		}

		if (Settings.find({}).fetch()[0].approval) {
			// Approval required
			// Add to DB but not CP
			try {
				Movies.insert({
					title: request.title,
					id: request.id,
					imdb: imdb,
					released: request.released,
					user: request.user,
					downloaded: false,
					approved: false
				});
			} catch (error) {
				console.log(error.message);
				return false;
			}

			return true;
		} else {
			// No approval required
			
			if (Settings.find({}).fetch()[0].couchPotatoENABLED) {
				try {
					var add = CouchPotato.movieAdd(imdb);
				} catch (error) {
					console.log("Error adding to Couch Potato:", error.message)
					return false;
				}

				if (add) {
					try {
						Movies.insert({
							title: request.title,
							id: request.id,
							imdb: imdb,
							released: request.released,
							user: request.user,
							downloaded: false,
							approved: true
						});
					} catch (error) {
						console.log(error.message);
						return false;
					}

					return true;
				} else {
					return false;
				}
			} else {
				try {
					Movies.insert({
						title: request.title,
						id: request.id,
						imdb: imdb,
						released: request.released,
						user: request.user,
						downloaded: false,
						approved: true
					});
				} catch (error) {
					console.log(error.message);
					return false;
				}
			}
		}
	}
});