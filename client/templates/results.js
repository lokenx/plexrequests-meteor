Template.results.events({
    'submit form': function(event){
        var movie = document.querySelector('input[name="movie"]:checked').value;
        var id = document.querySelector('input[name="movie"]:checked').id;
        if (Movies.findOne({text: movie}) == undefined) {
            var mg = '<p>Movie was successfully requested! Want to <a href="javascript:document.getElementById(\'search\').focus()" class="alert-link">search again?</a></p>'
            document.getElementById("info").setAttribute("class", "alert alert-success");
            document.getElementById("info").innerHTML = mg;

            var mg = ""
            document.getElementById("overview").innerHTML = mg;

            var list = document.getElementById("results");
            while (list.firstChild) {
                    list.removeChild(list.firstChild);
            }

            Meteor.call('addMovie', movie);
            Meteor.call('pushBullet', movie);
            return false;
        } else {
            var mg = '<p>Movie has alrady been requested! <a href="javascript:document.getElementById(\'search\').focus()" class="alert-link">Request another movie?</a></p>';
            document.getElementById("info").setAttribute("class", "alert alert-warning");
            document.getElementById("info").innerHTML = mg;

            var mg = ""
            document.getElementById("overview").innerHTML = mg;

            var list = document.getElementById("results");
            while (list.firstChild) {
                    list.removeChild(list.firstChild);
            }
            return false }
        
}})