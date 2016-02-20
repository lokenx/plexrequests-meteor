Template.home.events({
	'submit #sign-in': function (event) {

    $('#submitButton').html('<i class="fa fa-cog fa-spin  fa-fw"></i>  Signing In');

    var plexUsername = $("#plex-username").val().toLowerCase();
    var plexPassword = $("#plex-password").val() || '';

    Meteor.call('checkPlexAuthentication', function(error, data) {
      if (error) {
      	Bert.alert( 'There was an issue logging in. Please try again!', 'danger');
      	console.error("Issue checking authentication status: " + error.message);
      } else if (data) {
        Meteor.call('checkPlexUser', plexUsername, plexPassword, function (error, result) {
          if (error) {
        		Bert.alert( error.message, 'danger');
            $('#submitButton').html('<i class="fa fa-user fa-fw"></i> Sign In');
            Session.setAuth('auth', "false");
          } else if (result === true) {
              Session.setAuth('auth', "true");
              Session.setAuth('user', plexUsername);
              Bert.alert( 'Successfully logged in!', 'success');
              Router.go('search.page');
          } else if (result === false) {
        		Bert.alert( 'Invalid login. Please try again!', 'danger');
            $('#submitButton').html('<i class="fa fa-user  fa-fw"></i> Sign In');
            Session.setAuth('auth', false);
          }
        });
       } else {
        Session.setAuth('auth', "true");
        Session.setAuth('user', plexUsername);
        Bert.alert( 'Successfully logged in!', 'success');
        Router.go('search.page');
      }
    });

    return false;
	}
});

Template.home.onCreated(function () {
	var instance = this;

	instance.requirePassword = new ReactiveVar(false);

	Meteor.call("checkPlexAuthenticationPasswords", function (error, data) {
		instance.requirePassword.set(data);
	})
});

Template.home.helpers({
	requirePassword: function () {
		return Template.instance().requirePassword.get();
	}
});
