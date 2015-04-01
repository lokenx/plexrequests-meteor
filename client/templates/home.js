Template.home.helpers({
    movie: function () {
      return Movies.find({});
    },
    moviesearched: function () {
      return MovieSearch.find({});
    }
});
