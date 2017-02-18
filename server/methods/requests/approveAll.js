Meteor.methods({
  approveAll: function () {
    var movies = Movies.find({approval_status: 0}).fetch();
    var tv = TV.find().fetch();

    movies.forEach(function (movie) {
          Meteor.call("approveRequest", movie);
    });

    tv.forEach(function (show) {
      Meteor.call("approveRequest", show);
    });

    return true;
  },
  denyAll: function (reason) {
    var movies = Movies.find({approval_status: 0}).fetch();
    var tv = TV.find({approval_status: 0}).fetch();

    movies.forEach(function (movie) {
      Meteor.call("denyRequest", movie._id, reason);
    });

    tv.forEach(function (show) {
      Meteor.call("denyRequest", show._id, reason);
    });

    return true;
  }
});
