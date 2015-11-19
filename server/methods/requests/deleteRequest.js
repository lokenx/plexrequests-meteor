Meteor.methods({
	"deleteRequest": function(request) {
		check(request, Object);

		// If not logged in return without doing anything
		if (!Meteor.user()) {
			return false;
		}

		if (request.imdb) {
			try {
				Movies.remove(request._id);
				return true;
			} catch (error) {
				logger.error("Deletion error -> " + error.message);
				return false;
			}
		} else if (request.tvdb) {
			try {
				TV.remove(request._id);
				return true;
			} catch (error) {
				logger.error("Deletion error -> " + error.message);
				return false;
			}
		}
	}
});
