Template.registerHelper('plexUser', function () {
	return Session.get("user");
});

Template.registerHelper('auth', function () {
	var auth = function () {
		if (Session.get("auth") === "true") {
			return true;
		} else if (Meteor.userId()) {
			return true;
		} else {
			return false;
		}
	};
	return auth();
});

Template.registerHelper('plexAuth', function () {
	return Session.get("auth") === "true";
});
