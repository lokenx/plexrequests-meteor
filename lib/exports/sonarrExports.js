function Server() {
    this.url = 'http://192.168.0.1'
    this.port = 8989
    this.api = 'abcdef012345'
    this.directory = ''
    this.module = 'Sonarr'
    this.log = function (level, msg) {
        return Meteor.call('logWrapper', this.module, level, msg)
    }
    this.fullUrl = function (endpoint) {
        var argCheck = Meteor.call('checksWrapper',  {
            sonarrUrl: {val: this.url, type: String},
            sonarrPort: {val: this.port, type: Number},
            sonarrApi: {val: this.api, type: String}
        })
        if(argCheck !== true){
            Sonarr.log('error', argCheck)
            return false
        }
        return this.url + ':' + this.port + this.directory + (endpoint || '')
    }
}

Sonarr = new Server()

Sonarr.systemStatus = function() {
    return Meteor.call('systemStatus', {})
}

Sonarr.profilesGet = function() {
    return Meteor.call('profilesGet', {})
}

Sonarr.seriesStats = function(tvdb) {
    return Meteor.call('seriesStats', tvdb, {})
}

Sonarr.seriesGet = function(tvdb) {
    return Meteor.call('seriesGet', tvdb, {})
}

Sonarr.seriesDelete = function(tvdb) {
    return Meteor.call('seriesDelete', tvdb, {})
}

Sonarr.seriesPost = function(tvdb, title, qualityProfileId, seasonFolder, rootFolderPath, episodes) {
    return Meteor.call('seriesPost', tvdb, title, qualityProfileId, seasonFolder, rootFolderPath, episodes, {})
}
