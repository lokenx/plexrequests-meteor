Template.couchpotato.helpers({
    tests: function () {
      return Settings.find({});
    },
    url: function () {
    return Meteor.absoluteUrl();
    }
});

