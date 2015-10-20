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
				console.log("Approval error -> " + error.message);
				return false;
			}
		}
	}
});