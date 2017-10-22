Meteor.methods({
    'sendPushbulletNotification': function(settings, title, body) {
        check(settings, Match.ObjectIncluding({ pushbulletAPI: Match.Any }))
        check(title, String)
        check(body, String)

        //////// Function Constants

        var access_token = settings.pushbulletAPI
        var channel_tag = settings.pushbulletChannel
        var device_id = settings.pushbulletDeviceID
        var pushbullet_url = 'https://api.pushbullet.com/v2/pushes'
        var payload = {}

        //////// Create JSON object of http.post Parameters
        if(typeof channel_tag === 'undefined' ) {
            if(typeof device_id === 'undefined') {
                payload = {
                    headers: {
                        'Access-Token': access_token
                    },
                    params: {
                        type: 'note',
                        title: title,
                        body: body
                    },
                    timeout: 4000
                }
                logger.debug("Pushbullet: Empty Channel and Device ID")
            } else {
                payload = {
                    headers: {
                        'Access-Token': access_token
                    },
                    params: {
                        type: 'note',
                        title: title,
                        body: body,
                        device_iden: device_id
                    },
                    timeout: 4000
                }
            }
            logger.debug('Pushbullet: Empty Channel')
        } else {
            if(typeof device_id === 'undefined') {
                payload = {
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
                }
                logger.debug("Pushbullet: Empty Device ID")
            } else {
                var err = 'Please only use either a channel or a device ID in Pushbullet!'
                logger.error('Pushbullet notification error: ' + err)
                throw err
            }
        }

        ////// Attempt to send notification with HTTP.post()

        try {
            HTTP.post(pushbullet_url, payload)
            return true
        }
	
        catch (error) {
            var err = error.response.data.error.message
            logger.error('Pushbullet notification error: ' + err)
            throw err
        }
    }
})
