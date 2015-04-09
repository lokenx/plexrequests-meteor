Template.plex.helpers({
    plexinfo: function () {
      return PlexAPI.find({});
    }
});

(function(){Template.home.events({
    "submit #plex-user-form": function (event) {
	    plexUsername = document.getElementById("plex-username").value;

            Meteor.call('checkPlexUser', plexUsername, function (err, data) {
               console.log(data);
                if (err) {
                    console.log(err)
                } else if (data) {
                    Session.setPersistent('plexauthuser', true);
                } else {
                    Session.set('plexauthuser', false);
                }
            });
            return false;
    }
});

})();


