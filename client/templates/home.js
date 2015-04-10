Template.home.helpers({
    movie: function () {
        var date = new Date(+new Date - 12096e5);
        return Movies.find({$or: [
            { downloaded : false },
            { downloaded : true , createdAt: {"$gte": date} }
        ]},
            {sort:{createdAt:-1}});
    },
    moviesearched: function () {
      return MovieSearch.find({});
    }
});

Template.home.events({
    "submit #plex-user-form": function (event) {
	    plexUsername = document.getElementById("plex-username").value;

            Meteor.call('checkPlexUser', plexUsername, function (err, data) {
                if (err) {
                    console.log(err)
                } else if (data) {
                    Session.setPersistent('plexauthuser', true);
                    Session.setPersistent('plexuser', plexUsername);
                } else {
                    alert("Sorry, we don't recognize that username, try again?");
                    Session.set('plexauthuser', false);
                }
            });
            return false;
    }
});