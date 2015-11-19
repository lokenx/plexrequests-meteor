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
    var access_token = Settings.find().fetch()[0].pushbulletAPI;

    try {
      var test = HTTP.post("https://api.pushbullet.com/v2/pushes",
        {headers: {'Access-Token': access_token},
        params: {type: 'note', title: 'Plex Requests', body: 'Test notification!'},
        timeout: 4000});

      logger.info("Pushbullet tested successfully")
      return true;
    } catch (error) {
      logger.error("Error testing Pushbullet: " + error.response.data.error.message)
      throw new Meteor.Error(401, error.response.data.error.message);
    }
  },
  testPushover: function () {
    var settings = Settings.find().fetch()[0];
    var access_token = settings.pushoverAPI;
    var user_key = settings.pushoverUSER;

    try {
      var test = HTTP.post("https://api.pushover.net/1/messages.json",
        {params: {token: access_token, user: user_key, title: 'Plex Requests', message: 'Test notification'},
        timeout: 4000});

      logger.info("Pushover tested successfully")
      return true;
    } catch (error) {
      logger.error("Error testing Pushover: " + error.response.data.errors[0])
      throw new Meteor.Error(401, error.response.data.errors[0]);
    }
  }
});
