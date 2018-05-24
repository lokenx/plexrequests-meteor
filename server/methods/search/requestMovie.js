// TODO: Clean up the requestMovie method, much of the logic is duplicated throughout and can be simplified
// TODO: Define what exactly gets returned by each clients "add movie" method for uniform, predictable returns

Meteor.methods({
    'requestMovie': function(request) {
        check(request, Object)
        var poster = request.poster_path || '/'
        var settings = Settings.find().fetch()[0]

        request['notification_type'] = 'request'
        request['media_type'] = 'Movie'

        function insertMovie(request, imdbid, dlStatus, approvalStatus, poster, service) {

            try {
                if (service === 'couchpotato'){
                    CouchPotato.movieAdd(imdbid)
                } else if (service === 'radarr'){
                    Radarr.radarrMovieAdd(request, settings)
                }
                Movies.insert({
                    title: request.title,
                    id: request.id,
                    imdb: imdbid,
                    year: request.year,
                    released: request.release_date,
                    user: request.user,
                    downloaded: dlStatus,
                    approval_status: approvalStatus,
                    poster_path: poster
                })
                Meteor.call('sendNotifications', request)
                return true
            } catch (error) {
                Plexrequests.log('error', error)
                return false
            }

        }

        if (Meteor.call('limitCheck', request.user, 'movie')) {return 'limit'}

        try {
            var imdb = TMDBSearch.externalIds(request.id, 'movie')
            if (imdb.indexOf('tt') === -1) {
                Plexrequests.log('error', 'Error getting IMDB ID, none found!')
                return false
            } else {
                request['imdb'] = imdb
            }
        } catch (error) {
            Plexrequests.log('error', 'Error getting IMDB ID:' + error)
            return false
        }

        if (settings.couchPotatoENABLED) {
            try {
                var checkCP = CouchPotato.mediaGet(imdb)
                var status = checkCP.status === 'done'
                if (checkCP.status !== 'false' && checkCP !== false) {
                    insertMovie(request, imdb, status, 1, poster)
                    // Using these values to set client states
                    // TODO: Look into alternate method for this

                    if (status) {
                        return 'exists'
                    } else {
                        return false
                    }
                }
            } catch (error) {
                Plexrequests.log('error', 'Error checking Couch Potato:' + error)
                return false
            }
        }

        if (settings.radarrENABLED) {
            try {
                var checkRadarr = Radarr.radarrMovieGet(request.id)
                if (checkRadarr !== false) {
                    Radarr.log('info', 'Movie already present in Radarr')
                    insertMovie(request, imdb, checkRadarr.downloaded, 1, poster)
                    // Using these values to set client states
                    // TODO: Look into alternate method for this
                    return 'exists'
                }
            } catch (error) {
                Radarr.log('error', 'Error checking Radarr:' + error)
                return false
            }
        }
        // If approval needed and user does not have override permission
        if (Meteor.call('approvalCheck', request.user, 'movie')){

            try {
                insertMovie(request, imdb, false, 0, poster, null)
                return true
            } catch (error) {
                Plexrequests.log('error', error)
                return false
            }

        } else {
            // No approval required
            if (settings.couchPotatoENABLED) {
                try {
                    insertMovie(request, imdb, false, 1, poster, 'couchpotato')
                    return true
                } catch (error) {
                    Plexrequests.log('error', 'Error adding to Couch Potato: ' + error)
                    return false
                }

            } else if (settings.radarrENABLED) {
                try {
                    insertMovie(request, imdb, false, 1, poster, 'radarr')
                    return true
                } catch (error) {
                    Plexrequests.log('error', 'Error adding to Radarr: ' + error)
                    return false
                }

            } else {
                try {
                    insertMovie(request, imdb, false, 1, poster, null)
                    return true
                } catch (error) {
                    Plexrequests.log('error', error)
                    return false
                }

            }
        }
    }
})
