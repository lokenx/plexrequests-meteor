//Need to build a better helper to check if plex token is set, if so, call script
//Not needed -- make the page more explicit e.g. if you want to use plex auth please blah blah
Template.plex.events({
    "submit #plex-login-form": function (event) {
	    $('#plex-error').hide();
	    $('#plex-login-form button').html('<i class="fa fa-cog fa-spin  fa-fw"></i>  Signing In');
	    plexUsername = document.getElementById("plex-username").value;
	    plexPassword = document.getElementById("plex-password").value;

            Meteor.call('PlexLogin', plexUsername, plexPassword,  function (err, data) {
                if (err) {
                    //Basic handling, assuming incorrect details, will expand once server side done
                    $('#plex-error').show();
                    $('#plex-login-form button').html('<i class="fa fa-user fa-fw"></i> Sign In');
                } else if (data) {
                    $('.plexAuthEnabled').removeAttr('style');
                    $('a.show-plex-form').show();
                    $('.plexAuth').hide();
                    Session.setPersistent('plexauthuser', true);
                    Session.setPersistent('plexuser', plexUsername);
                }
            });
            return false;
    }
});

Template.plex.helpers({
    url: function () {
    return Meteor.absoluteUrl();
    }
});
