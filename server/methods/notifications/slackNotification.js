Meteor.methods({
  "sendSlackNotification": function (settings, text) {
    var webhookUrl = settings.slackAPI;
    var username = settings.slackUsername;
    var channel = settings.slackChannel;
    var data = {
      text: text
    };

    if (username) {
      data.username = username;
    }
    if (channel) {
      data.channel = channel;
    }

    try {
      HTTP.post(
        webhookUrl,
        {
          data: data,
          timeout: 4000
        }
      );

      return true;
    } catch (error) {
      var err = error.response.content;
      logger.error('Slack notification error: ' + err);
      throw err;
    }
  }
});