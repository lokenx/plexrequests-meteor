Meteor.methods({
  "sendPushbulletNotification": function (settings, title, body) {
    var access_token = settings.pushbulletAPI;
    var channel_tag = settings.pushbulletChannel;
    var pushbullet_url = 'https://api.pushbullet.com/v2/pushes';

    try {
      HTTP.post(
        pushbullet_url,
        {
          headers: {
            'Access-Token': access_token
          },
          params: {
            type: 'note',
            title: title,
            body: body,
            channel: channel_tag
          },
          timeout: 4000
        }
      );
      return true;
    } catch (error) {
      var err = error.response.data.error.message;
      logger.error("Pushbullet notification error: " + err);
      throw err;
    }
  }
});