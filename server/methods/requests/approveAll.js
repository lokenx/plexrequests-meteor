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
  },
  denyAll: function () {
    var movies = Movies.find({approval_status: 0}).fetch();
    var tv = TV.find({approval_status: 0}).fetch();

    movies.forEach(function (movie) {
      Meteor.call("denyRequest", movie);
    });

    tv.forEach(function (show) {
      Meteor.call("denyRequest", show);
    });

    return true;
  }
});
