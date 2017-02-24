// TODO: Clean up the approveRequest method. Approving the request should be a single action and client agnostic
// TODO: Define what should be returned by the "movie info" methods of each client. Should be uniform across clients

Meteor.methods({
	"approveRequest": function(request) {
        check(request, Object);
        var settings = Settings.find().fetch()[0];
        var status = null;

        // If not logged in return without doing anything
        if (!Meteor.user()) {
            return false;
        }

        if (request.imdb) {
            // First confirm it doesn't exist already
            try {
                if (settings.couchPotatoENABLED) {
                    var checkCP = CouchPotato.mediaGet(request.imdb);
                    status = checkCP.status == "done";
                    if (checkCP.status !== "false" && checkCP !== false) {
                        try {
                            Movies.update(request._id, {$set: {approval_status: 1, downloaded: status}});
                            return true;
                        } catch (error) {
                            logger.error(error.message);
                            return false;
                        }
                    }
                }
            } catch (error) {
                logger.error('Error checking CouchPotato', error.message);
                return false;
            }

            try {
				if (settings.radarrENABLED) {
					var checkRadarr = Radarr.radarrMovieGet(request.id);
					if (checkRadarr) {

						status = Radarr.radarrMovieGet(request.id);
						try {
							Movies.update(request._id, {$set: {approval_status: 1, downloaded: status}});
							return true;
						} catch (error) {

							logger.error(error.message);
							return false;
						}
					}
				}

            } catch (error) {
                logger.error('Error checking Radarr: ', error.message);
                return false;
            }

            // Doesn't exist so try to add
            if (settings.couchPotatoENABLED) {
                try {
                    if (CouchPotato.movieAdd(request.imdb)) {
                        Movies.update(request._id, {$set: {approval_status: 1, downloaded: false}});
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    logger.error("Error adding to Couch Potato:", error.message);
                    return false;
                }

            } else if (settings.radarrENABLED) {
                var radarrQualityProfileId = settings.radarrQUALITYPROFILEID;
                var RadarrRootFolderPath = settings.radarrROOTFOLDERPATH;
                try {
                    if (Radarr.radarrMovieAdd(request, settings)) {
                        Movies.update(request._id, {$set: {approval_status: 1, downloaded: false}});
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    logger.error("Error adding to Radarr: ", error.message);
                    return false;
                }
            } else {
				Movies.update(request._id, {$set: {approval_status: 1}});
				return true;
			}

            } else {
                if (settings.sickRageENABLED) {
                    // First confirm it doesn't exist already
                    try {
                        if (settings.sickRageENABLED) {
                            var checkSickRage = SickRage.checkShow(request.tvdb);
                            if (checkSickRage) {
                                status = SickRage.statsShow(request.tvdb);
                                try {
                                    TV.update(request._id, {$set: {approval_status: 1, status: status}});
                                    return true;
                                } catch (error) {
                                    logger.error(error.message);
                                    return false;
                                }
                            }
                        }
                    } catch (error) {
                        logger.error("Error checking SickRage:", error.message);
                        return false;
                    }

                    // Doesn't exist so try to add
                    try {
                        var episodes = (request.episodes === true) ? 1 : 0;
                        if (SickRage.addShow(request.tvdb, episodes)) {
                            TV.update(request._id, {$set: {approval_status: 1}});
                            return true;
                        } else {
                            logger.error("Error adding to SickRage");
                            return false;
                        }
                    } catch (error) {
                        logger.error("Error adding to SickRage:", error.message);
                        return false;
                    }
                } else if (settings.sonarrENABLED) {
                    // First confirm it doesn't exist already
                    try {
                        if (settings.sonarrENABLED) {
                            var checkSonarr = Sonarr.seriesGet(request.tvdb);

                            if (checkSonarr) {
                                status = Sonarr.seriesStats(request.tvdb);
                                try {
                                    TV.update(request._id, {$set: {approval_status: 1, status: status}});
                                    return true;
                                } catch (error) {
                                    logger.error(error.message);
                                    return false;
                                }
                            }
                        }
                    } catch (error) {
                        logger.error("Error checking Sonarr:", error.message);
                        return false;
                    }

                    var qualityProfileId = settings.sonarrQUALITYPROFILEID;
                    var seasonFolder = settings.sonarrSEASONFOLDERS;
                    var rootFolderPath = settings.sonarrROOTFOLDERPATH;
                    try {
                        if (Sonarr.seriesPost(request.tvdb, request.title, qualityProfileId, seasonFolder, rootFolderPath, request.episodes)) {
                            TV.update(request._id, {$set: {approval_status: 1}});
                            return true;
                        } else {
                            return false;
                        }
                    } catch (error) {
                        logger.error("Error adding to Sonarr:", error.message);
                        return false;
                    }
                } else {
                    TV.update(request._id, {$set: {approval_status: 1}});
                    return true;
                }
            }
    },

	"denyRequest": function(docID, reason) {
		// If not logged in return without doing anything
		if (!Meteor.user()) {
			return false;
		}
		
		//Set default reason
		if(reason == ""){
			reason = "This request has been denied";
		}
		
		//Check if movie
		if(Movies.findOne({_id: docID}) != undefined) {
			try {
				//Update db
				Movies.update(docID, {$set: {approval_status: 2, denied_reason: reason}});
				return true;

			} catch (error) {
				logger.error("Error denying Movie", error.message);
				return false;
			}
		}
		else {
			try {
				//Update db
				TV.update(docID, {$set: {approval_status: 2, denied_reason: reason}});
				return true;

			} catch (error) {
				logger.error("Error denying TV show", error.message);
				return false;
			}
		}
	}
});
