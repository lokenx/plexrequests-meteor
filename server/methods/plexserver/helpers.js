var checkMovieQuery = function(request, callback) {
  PlexServer.query("/search?query=" + request.title).then(function (results) {
    var filteredResults = results._children.filter(function (result) {
      if ((result.title === request.title) && (result.year == request.year)) {
        return true;
      }
    });
    return (filteredResults.length != 0) ? callback(null, true): callback(null, false);
  })
  .catch(function (error) {
    logger.error('Error checking PMS:', error);
    return callback(null, false);
  });
};

var checkMovie = Meteor.wrapAsync(checkMovieQuery);


PlexHelpers = {
  checkMovie: checkMovie
}
