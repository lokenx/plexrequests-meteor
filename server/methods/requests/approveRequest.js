Meteor.methods({
	"approveRequest": function(request) {
		check(request, Object);

		// If not logged in return without doing anything
		if (!Meteor.user()) {
			return false;
		}

		if (request.imdb) {
			try {
				Movies.update(request._id, {$set: {approved: true}});

				if (Settings.find({}).fetch()[0].couchPotatoENABLED) {
					try {
						var add = CouchPotato.movieAdd(imdb);
						console.log(add);
						return add;
					} catch (error) {
						console.log("Error adding to Couch Potato:", error.message)
						return false;
					}
				} else {
					return true;
				}

			} catch (error) {
				console.log("Approval error -> " + error.message);
				return false;
			}
		}
	}
});
