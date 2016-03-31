Meteor.methods({
	"requestMovie": function(request) {
		check(request, Object);
		var poster = "https://image.tmdb.org/t/p/w154" + request.poster_path || "/";
		var settings = Settings.find().fetch()[0];


		// Check user request limit
		var date = Date.now() - 6.048e8;
		var weeklyLimit = Settings.find({}).fetch()[0].weeklyLimit;
		var userRequestTotal = Movies.find({user:request.user, createdAt: {"$gte": date} }).fetch().length;

		if (weeklyLimit !== 0 && (userRequestTotal >= weeklyLimit) && !(Meteor.user()) ) {
			return "limit";
		}

		// Movie Request only requires IMDB_ID
		//Get IMDB ID
		try {
			var imdb = TMDBSearch.externalIds(request.id, "movie");
			if (imdb.indexOf("tt") === -1) {
				logger.error(("Error getting IMDB ID, none found!"));
				return false;
			}
		} catch (error) {
			logger.error("Error getting IMDB ID:", error.message);
			return false;
		}

		// Check if it already exists in CouchPotato
		if (settings.couchPotatoENABLED) {
			try {
				var checkCP = CouchPotato.mediaGet(imdb);
				var status = checkCP.status == "done";
				if (checkCP.status !== "false" && checkCP !== false) {
					try {
						Movies.insert({
							title: request.title,
							id: request.id,
							imdb: imdb,
							released: request.release_date,
							user: request.user,
							downloaded: status,
							approved: true,
							poster_path: poster
						});

						if (status) {
							return 'exists';
						} else {
							return true;
						}

					} catch (error) {
						logger.error(error.message);
						return false;
					}
				}
			} catch (error) {
				logger.error("Error checking Couch Potato:", error.message);
				return false;
			}
		}

		if (settings.approval) {
			// Approval required
			// Add to DB but not CP
			try {
				Movies.insert({
					title: request.title,
					id: request.id,
					imdb: imdb,
					released: request.release_date,
					user: request.user,
					downloaded: false,
					approved: false,
					poster_path: poster
				});
			} catch (error) {
				logger.error(error.message);
				return false;
			}

			Meteor.call("sendNotifications", request, "request");
			return true;
		} else {
			// No approval required

			if (settings.couchPotatoENABLED) {
				try {
					var add = CouchPotato.movieAdd(imdb);
				} catch (error) {
					logger.error("Error adding to Couch Potato:", error.message);
					return false;
				}

				if (add) {
					try {
						Movies.insert({
							title: request.title,
							id: request.id,
							imdb: imdb,
							released: request.release_date,
							user: request.user,
							downloaded: false,
							approved: true,
							poster_path: poster
						});
					} catch (error) {
						logger.error(error.message);
						return false;
					}
					Meteor.call("sendNotifications", request, "request");
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
						released: request.release_date,
						user: request.user,
						downloaded: false,
						approved: true,
						poster_path: poster
					});
					Meteor.call("sendNotifications", request, "request");
					return true;
				} catch (error) {
					logger.error(error.message);
					return false;
				}
			}
		}
	}
});
