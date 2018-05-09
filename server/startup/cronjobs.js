SyncedCron.config({
    log: false
})

SyncedCron.add({
    name: 'Update download status',
    schedule: function(parser) {
        return parser.text('every 1 hour')
    },
    job: function() {
        var settings = Settings.findOne()
        if(settings.couchPotatoENABLED) {
            Meteor.call('updateCP')
        }
        if(settings.radarrENABLED) {
            Meteor.call('updateRadarr')
        }
        if(settings.sickRageENABLED) {
            Meteor.call('updateSickRage')
        }
        if(settings.sonarrENABLED) {
            Meteor.call('updateSonarr')
        }

        return true
    }
})

SyncedCron.start()
