Template.registerHelper('movies', () => {
  return Movies.find();
});

Template.registerHelper('plexUser', () => {
	return Session.get("user");
});

Template.registerHelper('auth', () => {
	var auth = function () {
		if (Session.get("auth") === "true") {
			return true;
		} else {
			return false;
		}

		if (Meteor.userId()) {
			return true;
		}
	}
	return auth();
})