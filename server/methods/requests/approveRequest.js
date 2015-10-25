Meteor.methods({
	"approveRequest": function(request) {
		check(request, Object);
		var settings = Settings.find().fetch()[0];

		// If not logged in return without doing anything
		if (!Meteor.user()) {
			return false;
		}

		if (request.imdb) {
			try {
				if (settings.couchPotatoENABLED) {
					try {
						if (CouchPotato.movieAdd(request.imdb)) {
							Movies.update(request._id, {$set: {approved: true}});
							return true;
						} else {
							return false;
						}
					} catch (error) {
						console.log("Error adding to Couch Potato:", error.message)
						return false;
					}
				} else {
					Movies.update(request._id, {$set: {approved: true}});
					return true;
				}

			} catch (error) {
				console.log("Approval error -> " + error.message);
				return false;
			}
		} else {
			if (settings.sickRageENABLED) {
				// First confirm it doesn't exist already
				try {
					if (settings.sickRageENABLED) {
						var checkSickRage = SickRage.checkShow(request.tvdb);
						if (checkSickRage) {
							var status = SickRage.statsShow(request.tvdb);
							try {
								TV.update(request._id, {$set: {approved: true, status: status}});
								return true;
							} catch (error) {
								console.log(error.message);
								return false;
							}
						}
					}
				} catch (error) {
					console.log("Error checking SickRage:", error.message)
					return false;
				}

				// Doesn't exist so try to add
				try {
					var episodes = (request.episodes === true) ? 1 : 0;
					if (SickRage.addShow(request.tvdb, episodes)) {
						TV.update(request._id, {$set: {approved: true}});
						return true;
					} else {
						console.log("Error adding to SickRage");
						return false;
					}
				} catch (e) {
					console.log("Error adding to SickRage:", error.message);
					return false;
				}
			} else if (settings.sonarrENABLED) {
				// First confirm it doesn't exist already
				try {
					if (settings.sonarrENABLED) {
						var checkSonarr = Sonarr.seriesGet(tvdb);

						if (checkSonarr) {
							var status = Sonarr.seriesStats(tvdb);
							try {
								TV.update(request._id, {$set: {approved: true, status: status}});
								return true;
							} catch (error) {
								console.log(error.message);
								return false;
							}
						}
					}
				} catch (error) {
					console.log("Error checking Sonarr:", error.message)
					return false;
				}

				var qualityProfileId = settings.sonarrQUALITYPROFILEID
				var seasonFolder = settings.sonarrSEASONFOLDERS
				var rootFolderPath = settings.sonarrROOTFOLDERPATH
				try {
					if (Sonarr.seriesPost(request.tvdb,request.title, qualityProfileId, seasonFolder, rootFolderPath, request.episodes)) {
						TV.update(request._id, {$set: {approved: true}});
						return true;
					} else {
						return false;
					}
				} catch (error) {
					console.log("Error adding to Sonarr:", error.message);
					return false;
				}
			} else {
				TV.update(request._id, {$set: {approved: true}});
				return true;
			}
		}
	}
});
