Meteor.methods({
  sendNotifications: function (request, style) {
    check(request, Object);
    check(style, String);

    var settings = Settings.find().fetch()[0];
    var type = (request.media_type === "tv") ? "TV Show" : "Movie";

    if (style === "request") {
      if (settings.pushbulletENABLED) {
        var access_token = Settings.find().fetch()[0].pushbulletAPI;

        try {
          var test = HTTP.post("https://api.pushbullet.com/v2/pushes",
            {headers: {'Access-Token': access_token},
            params: {type: 'note', title: 'Plex Requests ' + type, body: request.title + " requested by " + request.user},
            timeout: 4000});

          return true;
        } catch (error) {
          logger.error('Pushbullet notification error: ' + error.response.data.error.message);
          return true;
        }
      } else if (settings.pushoverENABLED) {
        var access_token = settings.pushoverAPI;
        var user_key = settings.pushoverUSER;

        try {
          var test = HTTP.post("https://api.pushover.net/1/messages.json",
            {params: {token: access_token, user: user_key, title: 'Plex Requests ' + type, message: request.title + " requested by " + request.user},
            timeout: 4000});

          return true;
        } catch (error) {
          logger.error('Pushover notification error: ' + error.response.data.errors[0]);
          return true;
        }
      }
    } else {
      if (settings.pushbulletENABLED) {
        var access_token = Settings.find().fetch()[0].pushbulletAPI;

        try {
          var test = HTTP.post("https://api.pushbullet.com/v2/pushes",
            {headers: {'Access-Token': access_token},
            params: {type: 'note', title: 'Plex Requests ' + type + " Issue", body: request.title + " Issues: " + request.issues.toString() + " (" + request.user + ")"},
            timeout: 4000});

          return true;
        } catch (error) {
          logger.error('Pushbullet notification error: ' + error.response.data.error.message);
          return true;
        }
      } else if (settings.pushoverENABLED) {
        var access_token = settings.pushoverAPI;
        var user_key = settings.pushoverUSER;

        try {
          var test = HTTP.post("https://api.pushover.net/1/messages.json",
            {params: {token: access_token, user: user_key, title: 'Plex Requests ' + type + " Issue", message: request.title + " Issues: " + request.issues.toString() + " (" + request.user + ")"},
            timeout: 4000});

          return true;
        } catch (error) {
          logger.error('Pushover notification error: ' + error.response.data.errors[0]);
          return true;
        }
      }
    }


  }
});
