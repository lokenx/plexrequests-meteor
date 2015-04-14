Template.home.events({
    "submit .results": function (event) {
        $('#spinner').show();
        $('#resultsList').hide();

        if (Session.get('searchType') === 'movie') {
            var movie = document.querySelector('input[name="movie"]:checked').nextSibling.innerHTML;
            var id = document.querySelector('input[name="movie"]:checked').id;
            var puser = Session.get("plexuser");

            if (Movies.findOne({imdb: id}) === undefined) {
                Meteor.call('searchCP', id, movie, puser, function (err, data) {
                    if (err) {
                        console.log(err)
                    } else if ((data === "active") || (data ==="added")) {
                        $('#spinner').hide();
                        $('#addedSuccess').show();
                        Meteor.call('pushBullet', movie, puser);
                    } else if (data === "downloaded") {
                        $('#spinner').hide();
                        $('#addedError').val('Movie is already in Library...search again?');
                        $('#addedError').show();
                    }
                });
                return false;
            } else {
                if (Movies.findOne({imdb: id}).downloaded === true) {
                    $('#spinner').hide();
                    $('#addedError').val('Movie is already in Library...search again?');
                    $('#addedError').show();
                    return false;
                } else {
                    $('#spinner').hide();
                    $('#addedError').val('Movie already requested...search again?');
                    $('#addedError').show();
                    return false;
                }
            return false;
            }
        }
        return false;
    }
});
