Template.home.events({
    "submit .results": function (event) {
        $('#spinner').show();
        $('#resultsList').hide();

        if (Session.get('searchType') === 'movie') {
            var movie = document.querySelector('input[name="movie"]:checked').nextSibling.childNodes[0].innerHTML;
            var year = document.querySelector('input[name="movie"]:checked').nextSibling.childNodes[2].innerHTML;
            var id = document.querySelector('input[name="movie"]:checked').id;
            var puser = Session.get("plexuser");

            var imdb;
            var url = "http://api.themoviedb.org/3/movie/" + id + "?api_key=95a281fbdbc2d2b7db59680dade828a6";

            (function () {
                $.getJSON(url)
                    .done(function (data) {
                        imdb = data['imdb_id'];

                        if (Movies.findOne({imdb: imdb}) === undefined) {
                            Meteor.call('searchCP', imdb, movie, year, puser, function (err, data) {
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
                            if (Movies.findOne({imdb: imdb}).downloaded === true) {
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



                    })
                    .fail(function () {
                        console.log("fail");
                });
            }());


        } else if (Session.get('searchType') === 'tv') {
            var title = document.querySelector('input[name="movie"]:checked').nextSibling.childNodes[0].innerHTML;
            var year = document.querySelector('input[name="movie"]:checked').nextSibling.childNodes[2].innerHTML;
            var id = document.querySelector('input[name="movie"]:checked').id;
            var puser = Session.get("plexuser");

            var tvdb;
            var url = "http://api.themoviedb.org/3/tv/" + id + "/external_ids?api_key=95a281fbdbc2d2b7db59680dade828a6";

            (function () {
                $.getJSON(url)
                    .done(function (data) {
                        tvdb = data['tvdb_id'];

                        if (TV.findOne({tvdb: tvdb}) === undefined) {
                            Meteor.call('searchSickRage', tvdb, title, year, puser, function (err, data) {
                                if (err) {
                                    console.log(err);
                                    $('#spinner').hide();
                                    $('#addedError').val('Something went wrong, please let the admin know!');
                                    $('#addedError').show();
                                } else if (data ==="added") {
                                    $('#spinner').hide();
                                    $('#addedSuccess').show();
                                    Meteor.call('pushBullet', title, puser);
                                } else if (data === "downloaded") {
                                    $('#spinner').hide();
                                    $('#addedError').val('Series is already in Library...search again?');
                                    $('#addedError').show();
                                } else if (data === "error") {
                                    $('#spinner').hide();
                                    $('#addedError').val('Something went wrong, try again?');
                                    $('#addedError').show();
                                } else {
                                    console.log(data);
                                    console.log("Somethings broken...");
                                }
                            });
                            return false;
                        } else {
                            if (TV.findOne({tvdb: tvdb}).downloaded === true) {
                                $('#spinner').hide();
                                $('#addedError').val('Series is already in Library...search again?');
                                $('#addedError').show();
                                return false;
                            } else {
                                $('#spinner').hide();
                                $('#addedError').val('Series already requested...search again?');
                                $('#addedError').show();
                                return false;
                            }
                        return false;
                        }



                    })
                    .fail(function () {
                        console.log("fail");
                });
            }());

        }
        return false;
    }
});
