Meteor.methods({
  'updateSickRage' : function () {
    if (!(Settings.find({}).fetch()[0].sickRageENABLED)) {
      // logger.error("Can't update CouchPotato status if it's not enabled");
      return false;
    }

    var tv = TV.find({approved: true});

    tv.forEach(function (show) {
      var status = SickRage.statsShow(show.tvdb);
      TV.update(show, {$set: {status: status}});
    });

    return true;
  }
});
