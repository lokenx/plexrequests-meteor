Meteor.methods({
	"requestTV": function(request) {
		check(request, Object);
		var poster = request.poster_path || "/";
		var settings = Settings.find({}).fetch()[0];

		// Check user request limit
		var date = Date.now() - 6.048e8;
		var weeklyLimit = Settings.find({}).fetch()[0].tvWeeklyLimit;
		var userRequestTotal = TV.find({user:request.user, createdAt: {"$gte": date} }).fetch().length;

		if (weeklyLimit !== 0
			&& (userRequestTotal >= weeklyLimit)
			&& !(Meteor.user())
			//Check if user has override permission
			&& (!settings.plexAuthenticationENABLED || !Permissions.find({permUSER: request.user}).fetch()[0].permLIMIT)) {

				return "limit";
			}

			var tvdb = request.tvdb;
			function insertTV(request, stat, approved)
			{
				if (stat === undefined) {
					stat = {downloaded: 0, total: 0};
				}
				// We made the season info request it's own function which dramatically sped up searching!
				var seasonList = Meteor.call('tvseasons', request.id);

				TV.insert({
					title: request.title,
					id: request.id,
					tvdb: request.tvdb,
					released: request.release_date,
					user: request.user,
					status: stat,
					approval_status: approved,
					poster_path: poster,
					episodes: request.episodes,
					link: request.link,
					seasons: seasonList.length
				});
			}
			request["notification_type"] = "request";
			request["media_type"] = "TV Series";
			// Check if it already exists in SickRage or Sonarr
			try {
				if (settings.sickRageENABLED) {
					if (SickRage.checkShow(tvdb)) {
						try {
							var stat = SickRage.statsShow(tvdb);
							insertTV(request, stat, 1);
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
							insertTV(request, stat, 1);
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

			//If approval needed and user does not have override permission
			if (settings.tvApproval
				//Check if user has override permission
				&& (!settings.plexAuthenticationENABLED || !Permissions.find({permUSER: request.user}).fetch()[0].permAPPROVAL)) {

					// Approval required
					// Add to DB but not SickRage/Sonarr
					insertTV(request, undefined, 0);
					Meteor.call("sendNotifications", request);
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
								insertTV(request, undefined, 1);
								Meteor.call("sendNotifications", request);
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
								insertTV(request, undefined, 1);
								Meteor.call("sendNotifications", request);
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
							insertTV(request, undefined, 1);
							Meteor.call("sendNotifications", request);
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
