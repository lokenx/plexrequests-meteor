Meteor.methods({
    setIFTTTVARS: function(settings, request) {
	    var tags = {
		title: "<title>",
        type: "<type>",
        n_type: "<n_type>",
        user: "<user>",
        issues: "<issues>",
        year: "<year>",
        link: "<link>"
	    };


		if (request === 'test') {
			var req = {
				title: "A Test Movie",
				media_type: "Movie",
                notification_type: "request",
				user: "test_user",
				year: "2020",
				link: "https://plex.tv"
			};
            logger.info("Request type is test");

		} else {
            var req = request;
        };

        var r = {};
		if (settings.iftttMAKERVALUE1) {
            var v_1 = settings.iftttMAKERVALUE1.replace(tags.title, req.title);
	        var v_1 = v_1.replace(tags.type, req.media_type);
	        var v_1 = v_1.replace(tags.n_type, req.notification_type);
		    var v_1 = v_1.replace(tags.user, req.user);
		    var v_1 = v_1.replace(tags.issues, req.issues);
		    var v_1 = v_1.replace(tags.year, req.year);
		    var v_1 = v_1.replace(tags.link, req.link);
            r["value1"] = v_1;
        }

		if (settings.iftttMAKERVALUE2) {
		    var v_2 = settings.iftttMAKERVALUE2.replace(tags.title, req.title);
	        var v_2 = v_2.replace(tags.type, req.media_type);
	        var v_1 = v_1.replace(tags.n_type, req.notification_type);
		    var v_2 = v_2.replace(tags.user, req.user);
		    var v_2 = v_2.replace(tags.issues, req.issues);
		    var v_2 = v_2.replace(tags.year, req.year);
		    var v_2 = v_2.replace(tags.link, req.link);
            r["value2"] = v_2;
        }
        
		if (settings.iftttMAKERVALUE3) {
		    var v_3 = settings.iftttMAKERVALUE3.replace(tags.title, req.title);
	        var v_3 = v_3.replace(tags.type, req.media_type);
	        var v_1 = v_1.replace(tags.n_type, req.notification_type);
		    var v_3 = v_3.replace(tags.user, req.user);
		    var v_3 = v_3.replace(tags.issues, req.issues);
		    var v_3 = v_3.replace(tags.year, req.year);
		    var v_3 = v_3.replace(tags.link, req.link);
            r["value3"] = v_3;
        }

        return r;
    
    },

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
				link: "https://plex.tv"
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
  sonarrProfiles: function () {
    return Sonarr.profilesGet();
  },
  testIFTTT: function () {
    var settings = Settings.find().fetch()[0];
    console.log("Testing IFTTT Maker...");
    try {
	  Meteor.call("sendIFTTT", settings, request='test');
      logger.info("IFTTT Maker tested successfully");
    } catch (error) {
      throw new Meteor.Error(401, error);
    }
    return true;
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
  },
  
   updateSeasonCount: function() {
		try {
            var results = TV.find({seasons: -1}).fetch();
		    for(i=0;i<results.length;i++){
                var response = HTTP.call("GET", "http://api.tvmaze.com/shows/" + results[i].id + "/seasons", {})
                var seasons = response.data; 
                logger.info(results[i].id + " | " + results[i].title + " | " + seasons.length); 
           
                TV.update({_id: results[i]._id}, { $set: {seasons: seasons.length}});
            }
        } 
        catch (error) {
            (error)
            logger.info(error);
            return error.status_message;
        }
        return true;
	}
});
