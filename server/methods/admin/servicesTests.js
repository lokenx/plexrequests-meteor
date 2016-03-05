Meteor.methods({
  setTestVARS: function (t, b, request) {
		
	    var tags = {
		title: "<title>",
        type: "<type>",
        user: "<user>",
        issues: "<issues>",
        release: "<year>",
        link: "<link>"
	    };
		
		if (request === 'test') {
			var req = {
				title: "A Test Movie",
				type: "request",
				user: "test_user",
				release: "2020",
				link: "https//:plex.tv"
			};

		} else {var req = request;}

		var message_title = t.replace(tags.title, req.title);
	    var message_title = message_title.replace(tags.type, req.media_type);
		var message_title = message_title.replace(tags.user, req.user);
		var message_title = message_title.replace(tags.issues, req.issues);
		var message_title = message_title.replace(tags.release, req.release);
		var message_title = message_title.replace(tags.link, req.link);

		var message_body = b.replace(tags.title, req.title);
		var message_body = message_body.replace(tags.type, req.media_type);
		var message_body = message_body.replace(tags.user, req.user);
		var message_body = message_body.replace(tags.issues, req.issues);
		var message_body = message_body.replace(tags.release, req.release);
		var message_body = message_body.replace(tags.link, req.link);
		
		var r = {title: message_title, body: message_body}
		return r
  },	  
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
	  var message = Meteor.call("setTestVARS", settings.customNotificationTITLE, settings.customNotificationTEXT, request = 'test');
	  Meteor.call("sendPushbulletNotification", settings, message.title, message.body);
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
