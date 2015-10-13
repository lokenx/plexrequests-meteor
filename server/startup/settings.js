Meteor.startup(function () {

	if (Settings.find().count() === 0) {
		console.log("Adding default settings");
		Settings.insert({ });
	}

	//set TheMovieDB API

	TMDBSearch.api = "95a281fbdbc2d2b7db59680dade828a6";
	TMDBSearch.language = "en";

});