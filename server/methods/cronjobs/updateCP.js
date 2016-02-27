Meteor.methods({
  'updateCP' : function () {
    if (!(Settings.find({}).fetch()[0].couchPotatoENABLED)) {
      // logger.error("Can't update CouchPotato status if it's not enabled");
      return false;
    }

    var movies = Movies.find({downloaded: false, approved: true});

    movies.forEach(function (movie) {
      var result = CouchPotato.mediaGet(movie.imdb);
			var status = result.status == "done";

      if (result.status === "false") {
        // Not in CouchPotato anymore
        Movies.update(movie, {$set: {approved: false}});
      } else {
        Movies.update(movie, {$set: {downloaded: status}});        
      }
    });

    return true;
  }
});
