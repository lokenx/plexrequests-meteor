Template.layout.events({
	'click #logoutUser' : function () {
		Session.clearAuth()
		Router.go('/');
		Bert.alert("Successfully logged out!", "success");
	}
});

Template.layout.onCreated(function(){
	Meteor.call('userCount', function (err, data) {
    if (err) {
      console.log(err);
			$('#first-run-modal').modal('show');
    } else if (data == 0) {
    	$('#first-run-modal').modal('show');
    }
	});
});
