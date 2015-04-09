//Need to build a better helper to check if plex token is set, if so, call script
(function(){Template.plex.events({
    "submit #plex-login-form": function (event) {
	    plexUsername = document.getElementById("plex-username").value;
	    plexPassword = document.getElementById("plex-password").value;

            Meteor.call('PlexLogin', plexUsername, plexPassword,  function (err, data) {
               console.log(data);
                if (err) {
                    console.log(err)
                } else if (data) {
                    $('#plex-login-form').hide();
                    $('.plexauth').removeAttr('style');
                } else {
                    //Session.set('plexauthuser', false);
                }
            });
            return false;
    }
});

})();


(function(){Template.home.events({
    "submit #plex-user-form": function (event) {
	    plexUsername = document.getElementById("plex-username").value;

            Meteor.call('checkPlexUser', plexUsername, function (err, data) {
               console.log(data);
                if (err) {
                    console.log(err)
                } else if (data) {
                    Session.setPersistent('plexauthuser', true);
                    Session.setPersistent('plexuser', plexUsername);
                } else {
                    Session.set('plexauthuser', false);
                }
            });
            return false;
    }
});

})();

