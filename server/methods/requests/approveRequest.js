Meteor.methods({
	"approveRequest": function(request) {
		check(request, Object);

		// If not logged in return without doing anything
		if (!Meteor.user()) {
			return false;
		}

		if (request.imdb) {
			try {
				if (Settings.find({}).fetch()[0].couchPotatoENABLED) {
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
		}
	}
});
