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
        try {
            check(Radarr.url, String);
            check(Radarr.port, Number);
            check(Radarr.api, String);

            check(request.id, Number);
            check(request.title, String);
            check(request.year, String);

            check(settings.radarrQUALITYPROFILEID, Number);
            check(settings.radarrROOTFOLDERPATH, String);
            check(settings.radarrMINAVAILABILITY, String);

        } catch (e) {
            console.log("Radarr Movie Post -> " + e.message);
            return false;
        }
        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        var options = {"searchForMovie": 'true'};

        try {

            var response = HTTP.post(Radarr.url + ":" + Radarr.port + Radarr.directory + "/api/movie", {
                    headers: {"X-Api-Key":Radarr.api},
                    data: {
                        "title": request.title,
                        "tmdbId":request.id,
                        "year": request.year,
                        "qualityProfileId": settings.radarrQUALITYPROFILEID,
                        "rootFolderPath": settings.radarrROOTFOLDERPATH,
                        "minimumAvailability": settings.radarrMINAVAILABILITY,
                        "titleSlug": request.title,
                        "monitored": 'true',
                        "images": [],
                        "addOptions": options
                    },
                    timeout: 15000
                }
            );

        } catch (e) {
            console.log("Radarr Movie Post -> " + e.message);
            return false;
        }
        logger.log('debug', 'Radarr add response: \n' + JSON.stringify(response.data));
        return response.data
    },

    radarrSystemStatus: function() {
        try {
            check(Radarr.url, String)
            check(Radarr.port, Number)
            check(Radarr.api, String)
        } catch (e) {
            logger.debug('Radarr Status -> ' + e.message)
            return false
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
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
        /*
         Returns JSON object of movie data if found
         else:
         false if not
         */
        try {
            check(Radarr.url, String)
            check(Radarr.port, Number)
            check(Radarr.api, String)
            check(tmdbId, Number)
        } catch (e) {
            logger.debug('Radarr Movie Get -> ' + e.message)
            return false
        }

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
    },

    radarrMovieStatus: function(tmdbId) {
        try {
            check(Radarr.url, String)
            check(Radarr.port, Number)
            check(Radarr.api, String)
            check(tmdbId, Number)
        } catch (e) {
            logger.debug('Radarr Movie Get -> ' + e.message)
            return false
        }

        var result = {}

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        try {
            var allMovies = HTTP.get(Radarr.url + ':' + Radarr.port + Radarr.directory + '/api/movie', {headers: {'X-Api-Key':Radarr.api}, timeout: 15000} )
        } catch (e) {
            logger.debug('Radarr Movie Get -> ' + e.message)
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
            logger.debug(e)
            return false
        }

        if (response.data.downloaded) {
            result.status = response.data.downloaded
            result.title = response.data.title
            result.year = response.data.year || ''
            result.id = response.data.id
            result.imdb = response.data.imdbId || ''
            result.tmdb_id = response.data.tmdbId || ''
        } else {
            result = false
        }

        return result
    }
})