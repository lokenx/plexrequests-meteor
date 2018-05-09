Meteor.methods({
    radarrProfilesGet: function() {
        var status = Meteor.call('checksWrapper', {
            radarrUrl: {val: Radarr.url, type: String},
            radarrPort: {val: Radarr.port, type: Number},
            radarrApi: {val: Radarr.api, type: String}
        })
        if(status !== true){
            Radarr.log('error', status)
            return false
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        var allProfiles
        try {
            allProfiles = HTTP.get(Radarr.url + ':' + Radarr.port + Radarr.directory + '/api/profile', {headers: {'X-Api-Key':Radarr.api}, timeout: 15000} )
        } catch (e) {
            Radarr.log('error', 'Error fetching profiles: ' + e.message)
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
        var status = Meteor.call('checksWrapper', {
            radarrUrl: {val: Radarr.url, type: String},
            radarrPort: {val: Radarr.port, type: Number},
            radarrApi: {val: Radarr.api, type: String},
            requestId: {val: request.id, type: Number},
            requestTitle: {val: request.title, type: String},
            requestYear: {val: request.year, type: String},
            profileId: {val: settings.radarrQUALITYPROFILEID, type: Number},
            rootFolder: {val: settings.radarrROOTFOLDERPATH, type: String},
            minAvailability: {val: settings.radarrMINAVAILABILITY, type: String}
        })

        if(status !== true){
            Radarr.log('error', status)
            return []
        }

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
            Radarr.log('error', 'Post Error: ' + e.message)
            return false
        }
        return response.data
    },

    radarrSystemStatus: function() {
        var status = Meteor.call('checksWrapper', {
            radarrUrl: {val: Radarr.url, type: String},
            radarrPort: {val: Radarr.port, type: Number},
            radarrApi: {val: Radarr.api, type: String}
        })
        if(status !== true){
            Radarr.log('error', status)
            return false
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        try {
            var response = HTTP.get(Radarr.url + ':' + Radarr.port + Radarr.directory + '/api/system/status', {headers: {'X-Api-Key':Radarr.api}, timeout: 15000} )
        } catch (e) {
            Radarr.log('error', 'Status Check Error: ' + e.message)
            return false
        }


        return !!(response.data)
    },

    radarrMovieGet: function(tmdbId) {
        /*
         Returns JSON object of movie data if found
         else:
         false if not
         */
        var status = Meteor.call('checksWrapper', {
            radarrUrl: {val: Radarr.url, type: String},
            radarrPort: {val: Radarr.port, type: Number},
            radarrApi: {val: Radarr.api, type: String},
            tmdbId: {val: tmdbId, type: Number}
        })
        if(status !== true){
            Radarr.log('error', status)
            return false
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        try {
            var allMovies = HTTP.get(Radarr.url + ':' + Radarr.port + Radarr.directory + '/api/movie', {headers: {'X-Api-Key':Radarr.api}, timeout: 15000} )
        } catch (e) {
            Radarr.log('error', 'Error fetching movie: ' + e.message)
            return false
        }

        var parsed = JSON.parse(allMovies.content)
        var data = ''
        _.each(parsed, function (movie) {
            if (movie.tmdbId === tmdbId) {
                Radarr.log('debug', 'Movie found: ' + movie.title)
                data = movie
            }
        })
        
        return data || false
    },

    radarrMovieStatus: function(tmdbId) {
        var status = Meteor.call('checksWrapper', {
            radarrUrl: {val: Radarr.url, type: String},
            radarrPort: {val: Radarr.port, type: Number},
            radarrApi: {val: Radarr.api, type: String},
            tmdbId: {val: tmdbId, type: Number}
        })
        if(status !== true){
            Radarr.log('error', status)
            return false
        }
        
        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        try {
            var allMovies = HTTP.get(Radarr.url + ':' + Radarr.port + Radarr.directory + '/api/movie', {headers: {'X-Api-Key':Radarr.api}, timeout: 15000} )
        } catch (e) {
            Radarr.log('error', 'Error getting movie list: ' + e.message)
            return false
        }

        var radarrId

        _.each(allMovies.data, function (movie) {
            if (movie.tmdbId === tmdbId) {
                radarrId = movie.id
            }
        })

        try {
            var response = HTTP.call('GET', Radarr.url + ':' + Radarr.port + Radarr.directory + '/api/movie/' + radarrId, {headers: {'X-Api-Key':Radarr.api}, timeout: 15000} )
        } catch (e) {
            Radarr.log('error', 'Error finding movie ID: ' + radarrId + ': ' + e.message)
            return false
        }
        
        return (response.data.downloaded ? {
            status: response.data.downloaded,
            title: response.data.title,
            year: response.data.year || '',
            id: response.data.id,
            imdb: response.data.imdbId || '',
            tmdb_id: response.data.tmdbId || ''
        } : false)

    }
})