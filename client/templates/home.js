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
	    $('#plex-error').hide();
	    $('#plex-user-form button').html('<i class="fa fa-cog fa-spin  fa-fw"></i>  Signing In');
	    plexUsername = document.getElementById("plex-username").value;

            Meteor.call('checkPlexUser', plexUsername, function (err, data) {
                if (err) {
                    console.log(err)
                } else if (data) {
                    Session.setPersistent('plexauthuser', true);
                    Session.setPersistent('plexuser', plexUsername);
                } else {
	                 $('#plex-error').show();
	                 $('#plex-user-form button').html('<i class="fa fa-user  fa-fw"></i> Sign In');
                    Session.set('plexauthuser', false);
                }
            });
            return false;
    }
});