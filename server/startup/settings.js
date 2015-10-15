Meteor.startup(function () {

	if (Settings.find().count() === 0) {
		console.log("Adding default settings");
		Settings.insert({ });
	}

	//set TheMovieDB API
	TMDBSearch.api = "95a281fbdbc2d2b7db59680dade828a6";
	TMDBSearch.language = "en";

	//set Couch Potato on start-up
	CouchPotato.url = (Settings.find({}).fetch()[0].couchPotatoSSL) ? "https://" + Settings.find({}).fetch()[0].couchPotatoURL : "http://" + Settings.find({}).fetch()[0].couchPotatoURL;
	CouchPotato.port = Settings.find({}).fetch()[0].couchPotatoPORT;
	CouchPotato.api = Settings.find({}).fetch()[0].couchPotatoAPI;

});