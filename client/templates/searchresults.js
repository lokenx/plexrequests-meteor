Template.searchresults.helpers({
    statusIs: function (status) {
        return this.status === status;
    }
});

Template.searchresults.events({
    "click .add-request": function (event) {
        $(event.target).html('<i class="fa fa-spinner fa-spin fa-lg"></i>').removeClass('btn-primary');
        var title = $(event.target).parent().data( "title" );
        var year = $(event.target).parent().data( "year" );
        var id = $(event.target).parent().data( "id" );
        var puser = Session.get("plexuser");
        if (Session.get('searchType') === 'movie') {
          var imdb;
          var url = "http://api.themoviedb.org/3/movie/" + id + "?api_key=95a281fbdbc2d2b7db59680dade828a6";
          (function () {
                $.getJSON(url)
                    .done(function (data) {
                        imdb = data['imdb_id'];
                        id = data['id'];
                        if (Movies.findOne({imdb: imdb}) === undefined) {
                            Meteor.call('searchCP', id, imdb, title, year, puser, function (err, data) {
                                if (err) {
                                    console.log(err)
                                    $(event.target).parent().html('Something went wrong, please let the admin know!');
                                } else if ((data === "active") || (data ==="added")) {
                                    $(event.target).html('Movie added! <i class="fa fa-check-circle"></i>').addClass('btn-success').addClass('disabled');
                                    Meteor.call('pushService', title, year, puser, "Movie");
                                } else if (data === "downloaded") {
                                    $(event.target).html('<i class="icon-download-alt"></i> Already in Library').addClass('btn-warning').addClass('disabled');
                                } else if (data === "error") {
                                    $(event.target).html('<i class="fa fa-exclamation-triangle"></i> Error').addClass('btn-danger');
                                } else {
                                    console.log(data);
                                    console.log("Somethings broken...");
                                }
                            });
                            return false;
                        } else {
                            if (Movies.findOne({imdb: imdb}).downloaded === true) {
                                $(event.target).html('<i class="icon-download-alt"></i> Already in Library').addClass('btn-warning').addClass('disabled');
                                return false;
                            } else {
                                $(event.target).html('<i class="icon-share-alt"></i> Already Requested').addClass('btn-warning').addClass('disabled');
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
            var tvdb;
            var url = "http://api.themoviedb.org/3/tv/" + id + "/external_ids?api_key=95a281fbdbc2d2b7db59680dade828a6";
            (function () {
                $.getJSON(url)
                    .done(function (data) {
                        tvdb = data['tvdb_id'];
                        id = data['id'];
                        if (TV.findOne({tvdb: tvdb}) === undefined) {
                            Meteor.call('addTV', id, tvdb, title, year, puser, function (err, data) {
                                if (err) {
                                    console.log(err);
                                    $(event.target).parent().html('Something went wrong, please let the admin know!');
                                } else if (data ==="added") {
                                    $(event.target).html('TV Series added! <i class="fa fa-check-circle"></i>').addClass('btn-success').addClass('disabled');
                                    Meteor.call('pushService', title, year, puser, "TV");
                                } else if (data === "downloaded") {
                                    $(event.target).html('<i class="icon-share-alt"></i> Already in Library').addClass('btn-warning').addClass('disabled');
                                } else if (data === "error") {
                                    $(event.target).html('<i class="fa fa-exclamation-triangle"></i> Error').addClass('btn-danger');
                                } else {
                                    console.log(data);
                                    console.log("Somethings broken...");
                                }
                            });
                            return false;
                        } else {
                            if (TV.findOne({tvdb: tvdb}).downloaded === true) {
                                $(event.target).html('<i class="icon-download-alt"></i> Already in Library').addClass('btn-warning').addClass('disabled');
                                return false;
                            } else {
                                $(event.target).html('<i class="icon-share-alt"></i> Already Requested').addClass('btn-warning').addClass('disabled');
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
    }
});
