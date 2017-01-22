Meteor.methods({
  'updateRadarr' : function () {
    if (!(Settings.find({}).fetch()[0].radarrENABLED)) {
      // logger.error("Can't update CouchPotato status if it's not enabled");
      return false;
    }

    var movies = Movies.find({downloaded: false, approval_status: 1});

    movies.forEach(function (movie) {
        var result = Radarr.mediaGet(movie.imdb);
        var status = result.status == "done";

        if (result.status === "false") {
            // Not in Radarr anymore
            Movies.update(movie, {$set: {approved: false}});
        } else {
            Movies.update(movie, {$set: {downloaded: status}});
        }
    });
  }
});
