Template.home.events({
    "submit .results": function (event) {
        Session.set('searchingresults', true);
        Session.set('resultsloaded', false);

        var movie = document.querySelector('.title').innerHTML;
        var id = document.querySelector('input[name="movie"]:checked').id;

        if (Movies.findOne({imdb: id}) === undefined) {
            Meteor.call('searchCP', id, movie, function (err, results) {
                if (err) {
                    console.log(err)
                } else if (results === ("active" || "added")) {
                    Session.set('searchingresults', false);
                    Session.set('movieadded', true);
                    Meteor.call('pushBullet', movie);
                } else if (results === "downloaded") {
                    Session.set('searchingresults', false);
                    Session.set('moviedownloaded', true);
                }
            });
            return false;
        } else {
            Session.set('searchingresults', false);
            Session.set('movieexists', true);
            return false;
        }
        return false;
    }
});
