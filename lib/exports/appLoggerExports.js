function AppLog() {
    this.module = 'PlexRequests'
    this.log = function (level, msg) {
        return Meteor.call('logWrapper', this.module, level, msg)
    }
}

Plexrequests = new AppLog()
