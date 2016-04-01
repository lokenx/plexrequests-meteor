Meteor.methods({
	'updatePosters': function() {
		var results = Movies.find({poster_path: /^\//}).fetch()[0];
		if(results.poster_path){
			Movies.update(results._id, { $set: {poster_path: "https://image.tmdb.org/t/p/w154"+results.poster_path}})
		}
	}
});

