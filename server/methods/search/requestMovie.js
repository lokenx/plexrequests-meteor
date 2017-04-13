// TODO: Clean up the requestMovie method, much of the logic is duplicated throughout and can be simplified
// TODO: Define what exactly gets returned by each clients "add movie" method for uniform, predictable returns
// #td-done: Fix issue with not validating if movie exists in radarr

Meteor.methods({
	"requestMovie": function(request) {
		check(request, Object);
		var poster = "https://image.tmdb.org/t/p/w154" + request.poster_path || "/";
		var settings = Settings.find().fetch()[0];

		request["notification_type"] = "request";
		request["media_type"] = "Movie";
		// Check user request limit
		var date = Date.now() - 6.048e8;
		var weeklyLimit = Settings.find({}).fetch()[0].movieWeeklyLimit;
		var userRequestTotal = Movies.find({user:request.user, createdAt: {"$gte": date} }).fetch().length;

		// One function to rule them all!!
		// Or just to simplify adding movies to the DB
		function insertMovie(request, imdbid, dlStatus, approvalStatus, poster) {
			try {
				Movies.insert({
					title: request.title,
					id: request.id,
					imdb: imdbid,
					year: request.year,
					released: request.release_date,
					user: request.user,
					downloaded: dlStatus,
					approval_status: approvalStatus,
					poster_path: poster
				});
			} catch (error) {
				logger.error(error.message);
				return false;
			}
			return true;
		}

		if (weeklyLimit !== 0
			&& (userRequestTotal >= weeklyLimit)
			&& !(Meteor.user())
			//Check if user has override permission
			&& (!settings.plexAuthenticationENABLED || !Permissions.find({permUSER: request.user}).fetch()[0].permLIMIT)) {

				return "limit";
			}

			// Movie Request only requires IMDB_ID
			// Get IMDB ID
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
			// If it exists, insert into our collection
			if (settings.couchPotatoENABLED) {
				try {
					var checkCP = CouchPotato.mediaGet(imdb);
					var status = checkCP.status === "done";
					if (checkCP.status !== "false" && checkCP !== false) {
						insertMovie(request, imdb, status, 1, poster);
						// Using these values to set client states
						// TODO: Look into alternate method for this

						if (status) {
							return "exists";
						} else {
							return false
						}
					}
				} catch (error) {
					logger.error("Error checking Couch Potato:", error.message);
					return false;
				}
			}

			// Check if it exists in Radarr
			// Same deal here, check and bail on fail else continue on
			if (settings.radarrENABLED) {
				try {
					// MovieGet returns false if not found or the data from radarr as a JSON object if it exists
					// So here, just check if it's false and if so we can continue on
					var checkRadarr = Radarr.radarrMovieGet(request.id);
					logger.log('debug', "Radarr Movie info: \n" + JSON.stringify(checkRadarr));
					if (checkRadarr !== false) {
						logger.log('info', "Movie already present in Radarr");
						insertMovie(request, imdb, checkRadarr.downloaded, 1, poster);
						// Using these values to set client states
						// TODO: Look into alternate method for this
						return "exists"
					}
				} catch (error) {
					logger.error("Error checking Radarr:", error.message);
					return false;
				}
			}

			/*
			|	Making it here means the media did not exist in either client so we proceed to handling the request
			|	based on the users permissions.
			*/

			// If approval needed and user does not have override permission
			if (settings.movieApproval

				//Check if user has override permission
				&& (!settings.plexAuthenticationENABLED || !Permissions.find({permUSER: request.user}).fetch()[0].permAPPROVAL)) {

					// Approval required
					// Add to DB but do NOT send to client
					try {

						var result = insertMovie(request, imdb, false, 0, poster);

					} catch (error) {

						logger.error(error.message);
						return false;

					}

					if (result) {
						Meteor.call("sendNotifications", request);
						return true;
					}
					else {
						logger.error('Error sending notification');
						return false;
					}

				} else {
					// No approval required
					if (settings.couchPotatoENABLED) {

						// Were sending the request to CP here
						try {
							var add = CouchPotato.movieAdd(imdb);
						} catch (error) {
							logger.error("Error adding to Couch Potato:", error.message);
							return false;
						}

						// If the request was successful, insert the movie into our collection
						try {
							if (add) {
								result = insertMovie(request, imdb, false, 1, poster);
							}
						} catch (error) {

							logger.error(error.message);
							return false;

						}
						// If we added to our collection successfully, were ready to tell the world!
						if (result) {
							Meteor.call("sendNotifications", request);
							return true;
						}
						else {
							logger.error('Error sending notification');
							return false;
						}

						// Radarr's turn now
					} else if (settings.radarrENABLED) {
						// So, standard practice here, send the request to client then insert then notify.
						try {
							add = Radarr.radarrMovieAdd(request, settings);
						} catch (error) {
							logger.error("Error adding to Radarr:", error.message);
							return false;
						}
						if (add) {
							try {
								insertMovie(request, imdb, false, 1, poster);
							} catch (error) {
								logger.error(error.message);
								return false;
							}
							Meteor.call("sendNotifications", request);
							return true;
						} else {
							return false;
						}
					} else {
						// Nothing enabled but still add to DB

						try {
							insertMovie(request, imdb, false, 1, poster);
						} catch (error) {
							logger.error(error.message);
							return false;
						}
						Meteor.call("sendNotifications", request);
						return true;
					}
				}
			}
		});
