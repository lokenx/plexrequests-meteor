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

        //Return with error if both channel and device are defined
        if(typeof channel_tag !== 'undefined' && typeof device_id !== 'undefined') {
            var err = 'Please only use either a channel or a device ID in Pushbullet!'
            logger.error('Pushbullet notification error: ' + err)
            throw err
        }
        
        //Build base payload
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
        }

        //Add channel or device id parameters to the payload if applicable
        if(typeof channel_tag !== 'undefined' ) {
            payload['params'].channel_tag = channel_tag
        } else if(typeof device_id !== 'undefined') {
            payload['params'].device_iden = device_id
        }

        //Attempt to send notification with HTTP.post()
        try {
            HTTP.post(pushbullet_url, payload)
            return true
        } catch (error) {
            var err = error.response.data.error.message
            logger.error('Pushbullet notification error: ' + err)
            throw err
        }
    }
})
