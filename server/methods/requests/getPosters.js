Meteor.methods({
  getPosters: function () {
    var movies = Movies.find().fetch();

    movies.forEach(function (movie) {
      var poster = Meteor.call("movie", movie.id);

      if (!poster) { poster = "/" }
      
      Movies.update(movie._id, {$set: {
        poster_path: poster
      }});
    });

    return true;
  }
});
