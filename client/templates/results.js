Template.body.events({
    "submit .results": function (event) {
        Session.set('searchingresults', false);
        Session.set('resultsloaded', false);

        var movie = document.querySelector('input[name="movie"]:checked').value;
        var id = document.querySelector('input[name="movie"]:checked').id;

        if (Movies.findOne({imdb: id}) === undefined) {
            document.getElementById("info").setAttribute("class", "col-md-8 alert alert-success");
            document.getElementById("info").innerHTML = '<p>Movie was successfully requested!</p>';

            Meteor.call('addMovie', movie, id);
            Meteor.call('pushBullet', movie);
            Meteor.call('searchCP', id);
            return false;
        } else {
            document.getElementById("info").setAttribute("class", "col-md-8 alert alert-warning");
            document.getElementById("info").innerHTML = '<p>Movie has alrady been requested!</p>';

            return false;
        }
    }
});
