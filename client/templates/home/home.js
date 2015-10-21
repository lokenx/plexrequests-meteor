Template.home.events({
	'submit #sign-in': function (event) {


    $('#submitButton').html('<i class="fa fa-cog fa-spin  fa-fw"></i>  Signing In');

    plexUsername = $("#plex-username").val().toLowerCase();

    Meteor.call('checkPlexAuthentication', function(error, data) {
      if (error) {
      	Bert.alert( 'There was an issue logging in. Please try again!', 'danger');
      	console.log("Issue checking authentication status: " + error.message);
      } else if (data) {
        Meteor.call('checkPlexUser', plexUsername, function (error, result) {
          if (error) {
        		Bert.alert( 'There was an issue logging in. Please try again!', 'danger');
            $('#psubmitButton').html('<i class="fa fa-user  fa-fw"></i> Sign In');
            Session.setAuth('auth', "false");
          } else if (data === true) {
              Session.setAuth('auth', "true");
              Bert.alert( 'Successfully logged in!', 'success');
              Router.go('/search');
          } else if (data === false) {
        		Bert.alert( 'Wrong username entered. Please try again!', 'warning', 'growl-top-right' );  	
            $('#psubmitButton').html('<i class="fa fa-user  fa-fw"></i> Sign In');
            Session.setAuth('auth', false);
          }
        });
       } else {
        Session.setAuth('auth', "true");
        Session.setAuth('user', plexUsername);
        Bert.alert( 'Successfully logged in!', 'success');
        Router.go('/search');
      }
    });

    return false;
	}
})