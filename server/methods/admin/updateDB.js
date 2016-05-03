Meteor.methods({
	'updatePosters': function() {
		var results = TV.find({seasons: -1}).fetch();
		for(i=0;i<results.length;i++){
            var response = HTTP.call("GET", "http://api.tvmaze.com/shows/" + results[i].id + "/seasons", {})
            var seasons = response.data; 
           
            TV.update({_id: results[i]._id}, { $set: {seasons: seasons.length}});
		}
	}
});

