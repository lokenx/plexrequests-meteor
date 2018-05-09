Meteor.methods({
    'updateCP' : function () {
        var movies = Movies.find({downloaded: false, approval_status: 1})

        movies.forEach(function (movie) {
            var result = CouchPotato.mediaGet(movie.imdb)
            var status = result.status === 'done'

            if (result.status === 'false') {
                // Not in CouchPotato anymore
                Movies.update(movie, {$set: {approved: false}})
            } else {
                Movies.update(movie, {$set: {downloaded: status}})
            }
        })

        CouchPotato.log('info', 'Movie update check run successfully')
        return true
    }
})
