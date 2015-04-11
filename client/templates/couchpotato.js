Template.couchpotato.helpers({
    cp: function () {
      return Settings.findOne({_id: "couchpotatosetting"}).api;
    },
    url: function () {
    return Meteor.absoluteUrl();
    }
});

