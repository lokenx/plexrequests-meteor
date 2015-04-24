Template.sickrage.helpers({
    sr: function () {
      return Settings.findOne({_id: "sickragesetting"}).api;
    },
    url: function () {
    return Meteor.absoluteUrl();
    }
});

