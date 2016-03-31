Meteor.methods({
	"requestTV": function(request) {
		check(request, Object);
		var poster = request.poster_path || "/";
		var settings = Settings.find({}).fetch()[0];

		// Check user request limit
		var date = Date.now() - 6.048e8;
		var weeklyLimit = Settings.find({}).fetch()[0].weeklyLimit;
		var userRequestTotal = TV.find({user:request.user, createdAt: {"$gte": date} }).fetch().length;

		if (weeklyLimit !== 0 && (userRequestTotal >= weeklyLimit) && !(Meteor.user()) ) {
			return "limit";
		}

        var tvdb = request.tvdb;
        function insertTV(request, stat, approved)
        {
                if (stat === undefined) {
                    stat = {downloaded: 0, total: 0};
                }
                TV.insert({
                    title: request.title,
                    id: request.id,
                    tvdb: request.tvdb,
                    released: request.release_date,
                    user: request.user,
                    status: stat,
                    approved: approved,
                    poster_path: poster,
                    episodes: request.episodes,
					link: request.link
				});
        }

		// Check if it already exists in SickRage or Sonarr
		try {
			if (settings.sickRageENABLED) {
			    if (SickRage.checkShow(tvdb)) {
				    try {
                	    var stat = SickRage.statsShow(tvdb);
				        insertTV(request, stat, true);
                        return "exists";
                    }
                    catch (error) {
                        logger.error(error.message);
                        return false
                    }
                }
			} else if (settings.sonarrENABLED) {
                if (Sonarr.seriesGet(tvdb)) {
				    try {
                        var stat = Sonarr.seriesStats(tvdb);
                        insertTV(request, stat, true);
                        return "exists";
                    }
                    catch (error) {
                        logger.error(error.message);
                        return false
                    }
                }
			}
        }
        catch (error) {
			logger.error("Error checking SickRage/Sonarr:", error.message);
			return false;
		}
        if (settings.approval) {
			// Approval required
			// Add to DB but not SickRage/Sonarr
			insertTV(request, undefined, false);
			Meteor.call("sendNotifications", request, "request");
			return true;
		} else {
			//No approval required
			if (settings.sickRageENABLED) {
				try {
					var episodes = (request.episodes === true) ? 1 : 0;
					var add = SickRage.addShow(tvdb, episodes);
				}
                catch (error) {
					logger.error("Error adding to SickRage:", error.message);
					return false;
				}
                if (add) {
					try {
                        insertTV(request, undefined, true);
						Meteor.call("sendNotifications", request, "request");
						return true;
					}
                    catch (error) {
                	    logger.error(error.message);
						return false;
					}

                } else {
					logger.error("Error adding to SickRage");
					return false;
				}
			} else if (settings.sonarrENABLED) {
				try {
					var qualityProfileId = settings.sonarrQUALITYPROFILEID;
					var seasonFolder = settings.sonarrSEASONFOLDERS;
					var rootFolderPath = settings.sonarrROOTFOLDERPATH;
					var add = Sonarr.seriesPost(tvdb,request.title, qualityProfileId, seasonFolder, rootFolderPath, request.episodes);
				}
                catch (error) {
					logger.error("Error adding to Sonarr:", error.message);
					return false;
				}
    			if (add) {
					try {
                        insertTV(request, undefined, true);
						Meteor.call("sendNotifications", request, "request");
                        return true;
					}
                    catch (error) {
						logger.error(error.message);
						return false;
					}
				} else {
					logger.error("Error adding to Sonarr");
					return false;
				}
    		} else {
				try {
                    insertTV(request, undefined, true);
					meteor.call("sendNotifications", request, "request");
                    return true;
				}
                catch (error) {
					logger.error(error.message);
					return false;
				}
			}
		}
	}
});
