var checkMovieQuery = function(imdb) {
  PlexServer.query("/search?query=" + imdb).then(function (results) {
    var filteredResults = results._children.filter(function (result) {
      if ((result.type === 'movie') || (result.type === 'show') || (result.type === 'Video')) {
        return result;
      }
    });
    return filteredResults;
  });
};

var checkMovie = Meteor.wrapAsync(checkMovieQuery);


PlexHelpers = {
  checkMovie: checkMovie
}
