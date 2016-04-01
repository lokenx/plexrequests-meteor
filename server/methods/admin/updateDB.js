Meteor.methods({
	'updatePosters': function() {
		var results = TV.find({poster_path: /^\//}).fetch();
		for(i=0;i<results.length;i++){
			TV.update({_id: results[i]._id}, { $set: {poster_path: "https://image.tmdb.org/t/p/w154"+results[i].poster_path}});
		}
	}
});

