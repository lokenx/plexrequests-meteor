Template.body.events({
    "submit .results": function (event) {
        Session.set('searchingresults', false);
        Session.set('resultsloaded', false);

        var movie = document.querySelector('input[name="movie"]:checked').value;
        var id = document.querySelector('input[name="movie"]:checked').id;

        if (Movies.findOne({imdb: id}) === undefined) {
            Session.set('movieadded', true);
            Meteor.call('addMovie', movie, id);
            Meteor.call('pushBullet', movie);
            Meteor.call('searchCP', id);
            return false;
        } else {
            Session.set('movieexists', true);
            return false;
        }
    }
});
