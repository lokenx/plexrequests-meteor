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
		} else if (Meteor.userId()) {
			return true;
		} else {
			return false;
		}
	}
	return auth();
});

Template.registerHelper('plexAuth', () => {
	return (Session.get("auth") === "true") ? true : false;
})