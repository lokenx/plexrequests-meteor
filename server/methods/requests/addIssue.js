Meteor.methods({
	"addIssue": function(request, issue) {
		check(request, Object);
		check(issue, String);

		if (request.imdb) {
			try {
				Movies.update(request._id, {$push: {issues: issue}});
				return true;
			} catch (error) {
				console.log("Adding issue error -> " + error.message);
				return false;
			}
		} else if (request.tvdb) {
			try {
				TV.update(request._id, {$push: {issues: issue}});
				return true;
			} catch (error) {
				console.log("Adding issue error -> " + error.message);
				return false;
			}
		}
	}
});
