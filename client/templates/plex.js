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


/*
        Session.set('searchingresults', true);
        Session.set('resultsloaded', false);

        var movie = document.querySelector('input[name="movie"]:checked').nextSibling.innerHTML;
        var id = document.querySelector('input[name="movie"]:checked').id;

        if (Movies.findOne({imdb: id}) === undefined) {
            Meteor.call('searchCP', id, movie, function (err, data) {
                if (err) {
                    console.log(err)
                } else if ((data === "active") || (data ==="added")) {
                    Session.set('searchingresults', false);
                    Session.set('movieadded', true);
                    Meteor.call('pushBullet', movie);
                } else if (data === "downloaded") {
                    Session.set('searchingresults', false);
                    Session.set('moviedownloaded', true);
                }
            });
            return false;
        } else {
            if (Movies.findOne({imdb: id}).downloaded === true) {
                Session.set('searchingresults', false);
                Session.set('moviedownloaded', true);
                return false;
            } else {
                Session.set('searchingresults', false);
                Session.set('movieexists', true);
                return false;
            }
        return false;
        }*/
    }
});

})();


