Template.body.events({
    "submit .results": function (event) {
        Session.set('searchingresults', false);
        Session.set('resultsloaded', false);
        
        var movie = document.querySelector('input[name="movie"]:checked').value;
        var id = document.querySelector('input[name="movie"]:checked').id;
        
        if (Movies.findOne({text: movie}) === undefined) {
            document.getElementById("info").setAttribute("class", "alert alert-success");
            document.getElementById("info").innerHTML = '<p>Movie was successfully requested! Want to <a href="javascript:document.getElementById(\'search\').focus()" class="alert-link">search again?</a></p>';
            document.getElementById("overview").innerHTML = "";
            
            Meteor.call('addMovie', movie, id);
            Meteor.call('pushBullet', movie);
            
            return false;
        } else {
            document.getElementById("info").setAttribute("class", "alert alert-warning");
            document.getElementById("info").innerHTML = '<p>Movie has alrady been requested! <a href="javascript:document.getElementById(\'search\').focus()" class="alert-link">Request another movie?</a></p>';
            document.getElementById("overview").innerHTML = "";
            
            return false;
        }
    }
});