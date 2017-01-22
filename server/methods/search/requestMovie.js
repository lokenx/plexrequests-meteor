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

		if (weeklyLimit !== 0
			&& (userRequestTotal >= weeklyLimit)
			&& !(Meteor.user())
			//Check if user has override permission
			&& (!settings.plexAuthenticationENABLED || !Permissions.find({permUSER: request.user}).fetch()[0].permLIMIT)) {

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
								approval_status: 1,
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
			if (settings.radarrENABLED) {
				try {
					var checkRadarr = Radarr.radarrMovieGet(request.id);
					if (checkRadarr !== false) {
						try {
							Movies.insert({
								title: request.title,
								id: request.id,
								imdb: imdb,
								released: request.release_date,
								user: request.user,
								downloaded: checkRadarr,
								approval_status: 0,
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
					logger.error("Error checking Radarr:", error.message);
					return false;
				}
			}

			//If approval needed and user does not have override permission
			if (settings.movieApproval
				//Check if user has override permission
				&& (!settings.plexAuthenticationENABLED || !Permissions.find({permUSER: request.user}).fetch()[0].permAPPROVAL)) {

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
							approval_status: 0,
							poster_path: poster
						});
					} catch (error) {
						logger.error(error.message);
						return false;
					}

					Meteor.call("sendNotifications", request);
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
									approval_status: 1,
									poster_path: poster
								});
							} catch (error) {
								logger.error(error.message);
								return false;
							}
							Meteor.call("sendNotifications", request);
							return true;
						} else {
							return false;
						}
					} else if (settings.radarrENABLED) {

                            try {
                            	add = Radarr.radarrMovieAdd(request.id, request.title, settings.radarrQUALITYPROFILEID, settings.radarrROOTFOLDERPATH);
							} catch (error) {
								logger.error("Error adding to Radarr:", error.message);
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
										downloaded: status,
										approval_status: 1,
										poster_path: poster
									});
								} catch (error) {
									logger.error(error.message);
									return false;
								}
								Meteor.call("sendNotifications", request);
								return true;
                            } else {
                                return false;
                            }
						}
					}
				}
		});
