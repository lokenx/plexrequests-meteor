Meteor.methods({
    'updateSeasons': function() {
        var results = TV.find({seasons: -1}).fetch()
        for(var i = 0; i < results.length; i++) {
            try {
                var response = HTTP.call('GET', 'http://api.tvmaze.com/shows/' + results[i].id + '/seasons', {})
                var seasons = response.data
                TV.update({_id: results[i]._id}, { $set: {seasons: seasons.length}})
            } catch (e) {
                Plexrequests.log('warn', '[Not Found]: Couldn\'t update seasons for ', results[i].title)
            }
        }
        Plexrequests.log('info', 'Series with missing seasons data updated')
    },
    'updateApproved': function() {
        
        //Update documents using deprecitated 'approved'
        var movies = Movies.find({approval_status: -1}).fetch()
        var tv = TV.find({approval_status: -1}).fetch()
		
        for(var i = 0; i < movies.length; i++) {
            if(movies[i].approved) {
                Movies.update({_id: movies[i]._id}, { $set: {approval_status: 1}})
            }
            else {
                Movies.update({_id: movies[i]._id}, { $set: {approval_status: 0}})
            }
        }
        
        Plexrequests.log('info', 'Movies with depricated approval status updated')
        
        for(i = 0; i < tv.length; i++) {
            if(tv[i].approved) {
                TV.update({_id: tv[i]._id}, { $set: {approval_status: 1}})
            }
            else {
                TV.update({_id: tv[i]._id}, { $set: {approval_status: 0}})
            }
        }
        
        Plexrequests.log('info', 'Movies with depricated approval status updated')
    }
})
