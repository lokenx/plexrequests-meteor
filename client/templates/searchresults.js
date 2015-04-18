Template.results.helpers({
        contentSearched: function () {
            if (Session.get('searchType') === 'movie') {
                return MovieSearch.find({},{limit:10});
        } else if (Session.get('searchType') === 'tv') {
                return TVSearch.find({},{limit:10});
        }
    }
});

Template.searchresults.helpers({
  statusIs: function (status) {
    return this.status === status;
  }
});
Template.searchresults.events({
    "click .add-request": function (event) {
		$(event.target).html('<i class="fa fa-spinner fa-spin fa-lg"></i>').removeClass('btn-primary');
        var movie = $(event.target).parent().data( "title" );
        var id = $(event.target).parent().data( "id" );
        var puser = Session.get("plexuser");
        if (Movies.findOne({imdb: id}) === undefined) {
            Meteor.call('searchCP', id, movie, puser, function (err, data) {
                if (err) {
                    console.log(err)
                } else if ((data === "active") || (data ==="added")) {
	                $(event.target).html('Movie added! <i class="fa fa-check-circle"></i>').addClass('btn-success');
                    Meteor.call('pushBullet', movie, puser);
                } else if (data === "downloaded") {
                    $(event.target).html('Already in Library').addClass('btn-warning');
                }
            });
            return false;
        } else {
            if (Movies.findOne({imdb: id}).downloaded === true) {
                $(event.target).html('Already in Library').addClass('btn-warning');
                return false;
            } else {
                $(event.target).html('Already Requested').addClass('btn-warning');
                return false;
            }
        return false;
        }
    }
});