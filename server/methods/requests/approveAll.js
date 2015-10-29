Meteor.methods({
  approveAll: function () {
    var movies = Movies.find().fetch();
    var tv = TV.find().fetch();

    movies.forEach(function (movie) {
      Meteor.call("approveRequest", movie);
    });

    tv.forEach(function (show) {
      Meteor.call("approveRequest", show);
    });

    return true;
  }
});
