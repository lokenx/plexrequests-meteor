Template.layout.events({
	'click #logoutUser' : function () {
		Session.clearAuth()
		Router.go('/');
		Bert.alert("Successfully logged out!", "success");
	}
});
