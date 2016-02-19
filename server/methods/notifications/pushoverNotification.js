Meteor.methods({
  "sendPushoverNotification": function (settings, title, message) {
    var access_token = settings.pushoverAPI;
    var user_key = settings.pushoverUSER;
    var pushover_url = 'https://api.pushover.net/1/messages.json';

    try {
      HTTP.post(
        pushover_url,
        {
          params: {
            token: access_token,
            user: user_key,
            title: title,
            message: message
          },
          timeout: 4000
        }
      );
      return true;
    } catch (error) {
      var err = error.response.data.errors[0];
      logger.error("Pushover notification error: " + err);
      throw err;
    }
  }
});