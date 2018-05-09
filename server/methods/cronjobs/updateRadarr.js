Meteor.methods({
    'updateRadarr' : function () {
        var movies = Movies.find({downloaded: false, approval_status: 1})

        movies.forEach(function (movie) {
            var result = Radarr.radarrMovieStatus(movie.id)
            var status = result.status === true

            if (result.status === 'false') {
            // Not in Radarr anymore
                Movies.update(movie, {$set: {approved: false}})
            } else {
                Movies.update(movie, {$set: {downloaded: status}})
            }
        })
        Radarr.log('info', 'Movie update check run successfully')
        return true
    }
})
