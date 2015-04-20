Template.signin.events({
    'submit #plex-user-form': function (event) {
	    $('#plex-error').hide();
	    $('#plex-user-form button').html('<i class="fa fa-cog fa-spin  fa-fw"></i>  Signing In');
	    plexUsername = document.getElementById("plex-username").value;

        Meteor.call('checkPlexEnabled', function(err, data) {
            if (err) {
                console.log(err);
            } else if (data === true) {
                Meteor.call('checkPlexUser', plexUsername, function (err, data) {
                    if (err) {
                        $('#plex-user-form button').html('<i class="fa fa-user  fa-fw"></i> Sign In');
                        $('#plex-error').show();
                        Session.set('plexauthuser', false);
                    } else if (data === true) {
                        Session.setPersistent('plexauthuser', true);
                        Session.setPersistent('plexuser', plexUsername);
                    } else if (data === false) {
                        $('#plex-wrong').show();
                        $('#plex-user-form button').html('<i class="fa fa-user  fa-fw"></i> Sign In');
                        Session.set('plexauthuser', false);
                    } else {
                        $('#plex-user-form button').html('<i class="fa fa-user  fa-fw"></i> Sign In');
                        $('#plex-error').show();
                        Session.set('plexauthuser', false);
                    }
                });
            } else if (data === false) {
                Session.setPersistent('plexauthuser', true);
                Session.setPersistent('plexuser', plexUsername);            }
        });

        return false;
    }
});