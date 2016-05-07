Meteor.methods({
	'updateSeasons': function() {
		var results = TV.find({seasons: -1}).fetch();
		for(i = 0; i < results.length; i++) {
			try {
				var response = HTTP.call("GET", "http://api.tvmaze.com/shows/" + results[i].id + "/seasons", {});
				var seasons = response.data;
				TV.update({_id: results[i]._id}, { $set: {seasons: seasons.length}});
			} catch (e) {
				logger.warn("[Not Found]: Couldn't update seasons for", results[i].title);
			}
		}
	}
});
