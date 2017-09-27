

Meteor.methods({

    radarrProfilesGet: function() {
        try {
            check(Radarr.url, String)
            check(Radarr.port, Number)
            check(Radarr.api, String)
        } catch (e) {
            logger.debug('Radarr Profiles Get -> ' + e.message)
            return []
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        var allProfiles
        try {
            allProfiles = HTTP.get(Radarr.url + ':' + Radarr.port + Radarr.directory + '/api/profile', {headers: {'X-Api-Key':Radarr.api}, timeout: 15000} )
        } catch (e) {
            logger.debug('Radarr Profiles Get -> ' + e.message)
            return []
        }

        return _.map(allProfiles.data, function (profile) {
            return {
                id: profile.id,
                name: profile.name
            }
        })
    },

    radarrMovieAdd: function(request, settings) {
        check(request, Object) //TODO - create true check that verifies the values needed are actually set.
        check(settings, Object)
        check(Radarr.url, String)
        check(Radarr.port, Number)
        check(Radarr.api, String)

        check(request.id, Number)
        check(request.title, String)
        check(request.year, String)

        check(settings.radarrQUALITYPROFILEID, Number)
        check(settings.radarrROOTFOLDERPATH, String)
        check(settings.radarrMINAVAILABILITY, String)

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        var options = {'searchForMovie': 'true'}

        try {

            var response = HTTP.post(Radarr.url + ':' + Radarr.port + Radarr.directory + '/api/movie', {
                headers: {'X-Api-Key':Radarr.api},
                data: {
                    'title': request.title,
                    'tmdbId':request.id,
                    'year': request.year,
                    'qualityProfileId': settings.radarrQUALITYPROFILEID,
                    'rootFolderPath': settings.radarrROOTFOLDERPATH,
                    'minimumAvailability': settings.radarrMINAVAILABILITY,
                    'titleSlug': request.title,
                    'monitored': 'true',
                    'images': [],
                    'addOptions': options
                },
                timeout: 15000
            }
            )

        } catch (e) {
            logger.debug('Radarr Movie Post -> ' + e.message)
            return false
        }
        logger.log('debug', 'Radarr add response: \n' + JSON.stringify(response.data))
        return response.data
    },

    radarrSystemStatus: function() {
        check(Radarr.url, String)
        check(Radarr.port, Number)
        check(Radarr.api, String)

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        // TODO - Need to create a settings option that enables this only when needed
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        try {
            var response = HTTP.get(Radarr.url + ':' + Radarr.port + Radarr.directory + '/api/system/status', {headers: {'X-Api-Key':Radarr.api}, timeout: 15000} )
        } catch (e) {
            logger.debug('Radarr Status -> ' + e.message)
            return false
        }


        return !!(response.data)
    },

    radarrMovieGet: function(tmdbId) {
        check(Radarr.url, String)
        check(Radarr.port, Number)
        check(Radarr.api, String)
        check(tmdbId, Number)


        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        try {
            var allMovies = HTTP.get(Radarr.url + ':' + Radarr.port + Radarr.directory + '/api/movie', {headers: {'X-Api-Key':Radarr.api}, timeout: 15000} )
        } catch (e) {
            logger.debug('Radarr Movie Get -> ' + e.message)
            return false
        }

        var parsed = JSON.parse(allMovies.content)
        var data
        _.each(parsed, function (movie) {
            if (movie.tmdbId === tmdbId) {
                logger.log('debug', 'Movie found: \n' + movie.title)
                data = movie
            }
        })

        if (data) {
            logger.log('debug', 'Returned data')
            return data
        } else {
            logger.log('debug', 'Returned false')
            return false
        }
    }

})

