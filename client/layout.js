Template.layout.events({
	'click #logoutUser' : function () {
		Session.clearAuth()
		Router.go('/');
	}
});