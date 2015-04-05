Template.home.helpers({
    movie: function () {
      return Movies.find({}, {sort:{createdAt:-1}});
    },
    moviesearched: function () {
      return MovieSearch.find({});
    }
});
