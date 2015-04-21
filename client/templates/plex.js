Template.plex.events({
    "submit #plex-login-form": function (event) {
        $('#plex-error').hide();
        $('#plex-login-form button').html('<i class="fa fa-cog fa-spin  fa-fw"></i>  Signing In');
        plexUsername = document.getElementById("plex-username").value;
        plexPassword = document.getElementById("plex-password").value;

        Meteor.call('PlexLogin', plexUsername, plexPassword,  function (err, data) {
            if (err) {
                //Basic handling, assuming incorrect details, will expand if needed
                $('#plex-error').show();
                $('#plex-login-form button').html('<i class="fa fa-user fa-fw"></i> Sign In');
            } else if (data) {
                $('.plexAuthError').hide();
                $('.plexAuthSuccess').removeAttr('style');
                $('.plexAuthDisabled').hide();
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
