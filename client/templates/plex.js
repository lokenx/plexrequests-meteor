//Need to build a better helper to check if plex token is set, if so, call script
//Not needed -- make the page more explicit e.g. if you want to use plex auth please blah blah
Template.plex.events({
    "submit #plex-login-form": function (event) {
	    plexUsername = document.getElementById("plex-username").value;
	    plexPassword = document.getElementById("plex-password").value;

            Meteor.call('PlexLogin', plexUsername, plexPassword,  function (err, data) {
                if (err) {
                    //Basic handling, assuming incorrect details, will expand once server side done
                    alert("Error connecting to Plex.tv, wrong username or password, please try again");
                } else if (data) {
                    $('.plexAuthEnabled').removeAttr('style');
                    document.getElementById('plex-login-form').reset();
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
