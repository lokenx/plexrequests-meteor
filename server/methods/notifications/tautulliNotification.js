Meteor.methods({
    'getTautulliSettings': function () {
        const settings = Settings.find({}).fetch()
        var scheme = (settings.tautulliSSL === false) ? 'http//' : 'https//'
        var url = scheme + settings.tautulliURL + ':' + settings.tautulliPORT + '/api/v2'
        return {
            url: url,
            apikey: settings.tautulliAPI
        }

    },
    'getTautulliNotifiers': function (){
        const settings = Meteor.call('getTautulliSettings')

        var command = 'get_notifiers'

        var url = scheme + settings.url + ':' + settings.port + '/api/v2'
        var payload = { params: { apikey: settings.apikey, cmd: command  }, timeout: 4000}

        var notifiers = HTTP.get(url, payload)

        if (notifiers.json.response.result === 'error') {
            logger.error('Tautulli notification error: ' + notifiers.json.response.message)
            return false
        } else {
            return notifiers.json.response.data
        }
    },

    'sendTautulliNotification': function (title, message) {
        const settings = Meteor.call('getTautulliSettings')
        var scheme =
        var url = scheme + settings.tautulliURL + ':' + settings.tautulliPORT + '/api/v2'

    }

})