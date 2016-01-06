Meteor.methods({
  'updateSonarr' : function () {
    if (!(Settings.find({}).fetch()[0].sonarrENABLED)) {
      // logger.error("Can't update CouchPotato status if it's not enabled");
      return false;
    }

    var tv = TV.find({approved: true});

    tv.forEach(function (show) {
      var status = Sonarr.seriesStats(show.tvdb);
      if (status) {
        TV.update(show, {$set: {status: status}});        
      }
    });

    return true;
  }
});
