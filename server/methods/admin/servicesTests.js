Meteor.methods({
  testCouchPotato: function () {
    return CouchPotato.appAvailable();
  },
  testSickRage: function () {
    return SickRage.available();
  },
  testSonarr: function () {
    return Sonarr.systemStatus();
  },
  testPushbulllet: function () {
    var settings = Settings.find().fetch()[0];
    try {
      Meteor.call("sendPushbulletNotification", settings, 'Plex Requests', 'Test notification!');
      logger.info("Pushbullet tested successfully");
    } catch (error) {
      throw new Meteor.Error(401, error);
    }
    logger.info("Pushbullet tested successfully");
    return true;
  },
  testPushover: function () {
    var settings = Settings.find().fetch()[0];
    try {
      Meteor.call("sendPushoverNotification", settings, 'Pushover Requests', 'Test notification');
      logger.info("Pushover tested successfully");
    } catch (error) {
      throw new Meteor.Error(401, error);
    }
    logger.info("Pushover tested successfully");
    return true;
  },
  testSlack: function () {
    var settings = Settings.find().fetch()[0];
    try {
      Meteor.call("sendSlackNotification", settings, 'Plex Requests Test notification');
    } catch (error) {
      throw new Meteor.Error(401, error);
    }
    logger.info("Slack tested successfully");
    return true;
  }
});
