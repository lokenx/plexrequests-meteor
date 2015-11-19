Meteor.methods({
	"addIssue": function(request, issue) {
		check(request, Object);
		check(issue, String);

		if (request.imdb) {
			try {
				if (Movies.findOne(request._id).issues) {
					if (Movies.findOne(request._id).issues.indexOf(issue) !== -1) {
						return false;
					}
				}
				Movies.update(request._id, {$push: {issues: issue}});
				request.issues = issue;
				Meteor.call("sendNotifications", request, "issue");
				return true;
			} catch (error) {
				logger.error("Adding issue error -> " + error.message);
				return false;
			}
		} else if (request.tvdb) {
			try {
				TV.update(request._id, {$push: {issues: issue}});
				request.issues = issue;
				Meteor.call("sendNotifications", request, "issue");
				return true;
			} catch (error) {
				logger.error("Adding issue error -> " + error.message);
				return false;
			}
		}
	}
});
