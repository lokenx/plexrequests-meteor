Meteor.methods({
    profilesGet: function() {
        // var status = Meteor.call('checksWrapper', {
        //     sonarrUrl: {val: Sonarr.url, type: String},
        //     sonarrPort: {val: Sonarr.port, type: Number},
        //     sonarrApi: {val: Sonarr.api, type: String}
        // })
        // if(status !== true){
        //     Sonarr.log('error', status)
        //     return {}
        // }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        var allProfiles
        try {
            allProfiles = HTTP.call('GET', Sonarr.fullUrl('/api/profile'), {
                headers: {'X-Api-Key':Sonarr.api},
                timeout: 15000
            })
        } catch (e) {
            var eMsg = 'Error Fetching Profiles: ' + e.message
            Sonarr.log('error', eMsg)
            return {}
        }

        return _.map(allProfiles.data, function (profile) {
            return {
                id: profile.id,
                name: profile.name
            }
        })
    },
    seriesDelete: function(tvdb) {
        var argCheck = Meteor.call('checksWrapper',  {
            sonarrUrl: {val: Sonarr.url, type: String},
            sonarrPort: {val: Sonarr.port, type: Number},
            sonarrApi: {val: Sonarr.api, type: String},
            tvdbID: {val: tvdb, type: Number}
        })
        if(argCheck !== true){
            Sonarr.log('error', argCheck)
            return false
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        try {
            var allShows = HTTP.call('GET', Sonarr.fullUrl('/api/series/'), {
                headers: {'X-Api-Key':Sonarr.api},
                timeout: 15000
            })
        } catch (e) {
            Sonarr.log('error', 'Error fetching series list: ' + e.message)
            return false
        }

        var sonarrId = 0

        _.each(allShows.data, function (show) {
            if (show.tvdbId === tvdb) {
                sonarrId = show.id
            }
        })


        if (sonarrId !== 0) {
            try {
                var response = HTTP.call('DELETE', Sonarr.fullUrl('/api/series/' + sonarrId), {
                    headers: {'X-Api-Key':Sonarr.api},
                    timeout: 2000
                })
            } catch (e) {
                Sonarr.log('error', 'Error deleting series id ' + sonarrId + ': ' + e.message)
                return false
            }
        }

        return !!(response)
    },
    seriesGet: function(tvdb) {
        var argCheck = Meteor.call('checksWrapper',  {
            sonarrUrl: {val: Sonarr.url, type: String},
            sonarrPort: {val: Sonarr.port, type: Number},
            sonarrApi: {val: Sonarr.api, type: String},
            tvdbID: {val: tvdb, type: Number}
        })
        if(argCheck !== true){
            Sonarr.log('error', argCheck)
            return false
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        try {
            var allShows = HTTP.call('GET', Sonarr.fullUrl('/api/series/'), {headers: {'X-Api-Key':Sonarr.api}, timeout: 15000} )
        } catch (e) {
            Sonarr.log('error', 'Error fetching series list: ' + e.message)
            return false
        }

        var status = false

        _.each(allShows.data, function (show) {
            if (show.tvdbId === tvdb) {
                Sonarr.log('info', 'Series ' + show.title + ' already added')
                status = true
            }
        })

        return status
    },
    seriesPost: function(tvdb, title, qualityProfileId, seasonFolder, rootFolderPath, episodes) {
        var status = Meteor.call('checksWrapper', {
            sonarrUrl: {val: Sonarr.url, type: String},
            sonarrPort: {val: Sonarr.port, type: Number},
            sonarrApi: {val: Sonarr.api, type: String},
            tvdbID: {val: tvdb, type: Number},
            seriesTitle: {val: title, type: String},
            profileId: {val: qualityProfileId, type: Number},
            seasonFolder: {val: seasonFolder, type: Boolean},
            rootFolder: {val: rootFolderPath, type: String},
            dlEpisodes:{val: episodes, type: Boolean}
        })
        if(status !== true) {
            Sonarr.log('error', status)
            return false
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        // Since episodes is either true or false, just use its state to determine the values needed for each option.
        var options = {
            'ignoreEpisodesWithFiles': !episodes,
            'ignoreEpisodesWithoutFiles': !episodes,
            'searchForMissingEpisodes': episodes
        }

        try {
            var response = HTTP.call('POST', Sonarr.fullUrl('/api/series/'), {headers: {'X-Api-Key':Sonarr.api},
                data: {
                    'tvdbId': tvdb,
                    'title': title,
                    'qualityProfileId': qualityProfileId,
                    'seasons': [],
                    'seasonFolder': seasonFolder,
                    'rootFolderPath': rootFolderPath,
                    'addOptions': options,
                    'images': []
                }, timeout: 15000}
            )
        } catch (e) {
            Sonarr.log('error', e.message)
            return false
        }

        return !!(response.data)
    },
    seriesStats: function(tvdb) {
        var status = Meteor.call('checksWrapper', {
            sonarrUrl: {val: Sonarr.url, type: String},
            sonarrPort: {val: Sonarr.port, type: Number},
            sonarrApi: {val: Sonarr.api, type: String},
            tvdbID: {val: tvdb, type: Number}
        })
        if(status !== true) {
            Sonarr.log('error', status)
            return false
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        try {
            var allShows = HTTP.call('GET', Sonarr.fullUrl('/api/series/'), {
                headers: {'X-Api-Key':Sonarr.api},
                timeout: 15000
            })
        } catch (e) {
            Sonarr.log('error', 'Error fetching series list: ' + e.message)
            return false
        }

        var match = null

        _.each(allShows.data, function (show) {
            if (show.tvdbId === tvdb) {
                match = {sonarrId: show.id, seriesTitle: show.title}
            }
        })

        try {
            if (match !== null) {
                var response = HTTP.call('GET', Sonarr.fullUrl('/api/series/' + match.sonarrId) , {
                    headers: {'X-Api-Key': Sonarr.api},
                    timeout: 15000
                })
            } else {
                Sonarr.log('error', 'No series found matching TVDB ID ' + tvdb)
                return false
            }
        } catch (e) {
            if (e.message.indexOf('NotFound') > -1) {
                return {'downloaded' : 0, 'total' : 0}
            } else {
                Sonarr.log('error', 'Error fetching download status of ' + match.seriesTitle + ': ' + e.message)
                return false
            }
        }

        return {'downloaded' : response.data.episodeFileCount, 'total' : response.data.episodeCount}
    },
    systemStatus: function() {
        var checks = {
            sonarrUrl: {val: Sonarr.url, type: String},
            sonarrPort: {val: Sonarr.port, type: Number},
            sonarrApi: {val: Sonarr.api, type: String}
        }
        var status = Meteor.call('checksWrapper', checks)
        if(status !== true){
            Sonarr.log('error', status)
            return false
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        try {
            var response = HTTP.call('GET', Sonarr.fullUrl('/api/system/status'), {headers: {'X-Api-Key':Sonarr.api}, timeout: 15000} )
        } catch (e) {
            Sonarr.log('error', 'Error fetching service status: ' + e.message)
            return false
        }

        return !!(response.data)
    }
})
