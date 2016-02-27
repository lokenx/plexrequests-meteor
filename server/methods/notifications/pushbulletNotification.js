Meteor.methods({
	"sendPushbulletNotification": function(settings, title, body) {

//////// Function Constants

	var access_token = settings.pushbulletAPI;
	var channel_tag = settings.pushbulletChannel;
	var pushbullet_url = 'https://api.pushbullet.com/v2/pushes';

//////// Create JSON object of http.post Parameters
	if(typeof channel_tag === 'undefined' ) {
		var payload = {
				headers: {
					'Access-Token': access_token
				},
				params: {
					type: 'note',
					title: title,
					body: body
				},
				timeout: 4000
			};
		logger.debug('Empty Channel');
	} else {
		var payload = {
				headers: {
					'Access-Token': access_token
				},
				params: {
					type: 'note',
					title: title,
					body: body,
					channel_tag: channel_tag
				},
				timeout: 4000
			};
			logger.debug('channel_tag: ' + channel_tag);
		}

////// Attempt to send notification with HTTP.post()

	try {
		HTTP.post(pushbullet_url, payload);
		return true;
	}
	
	catch (error) {
		var err = error.response.data.error.message;
		logger.error("Pushbullet notification error: " + err);
		throw err;
	}
  }
});
