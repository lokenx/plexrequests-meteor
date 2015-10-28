Meteor.methods({
  getPosters: function () {
    var movies = Movies.find({$or: [{poster_path: {$exists: false}}, {poster_path: "/"}]}).fetch();
    var tv = TV.find({$or: [{poster_path: {$exists: false}}, {poster_path: "/"}]}).fetch();

    movies.forEach(function (movie) {
      var poster = Meteor.call("movie", movie.id);

      if (!poster) { poster = "/" }
      Movies.update(movie._id, {$set: {
        poster_path: poster
      }});
    });

    tv.forEach(function (show) {
      var poster = Meteor.call("tv", show.id);
      console.log(poster);
      if (!poster) { poster = "/" }
      TV.update(tv._id, {$set: {
        poster_path: poster
      }});
    });

    return true;
  }
});
