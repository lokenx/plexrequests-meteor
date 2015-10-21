Meteor.methods({
	'checkPlexAuthentication' : function () {
		return Settings.find({}).fetch()[0].plexAuthenticationENABLED;
	},
	'checkPlexUser' : function (plexUsername) {

		function isInArray(value, array) {
		  return array.indexOf(value) > -1;
		}

		var plexToken = Settings.find({}).fetch()[0].plexAuthenticationTOKEN;

		try {
      var friendsXML = Meteor.http.call("GET", "https://plex.tv/pms/friends/all?X-Plex-Token="+plexToken);
      var accountXML = Meteor.http.call("GET", "https://plex.tv/users/account?X-Plex-Token="+plexToken);
    } catch (error) {
      console.log("Error checking Plex Users: " + error.message);
      return false;
    }

		xml2js.parseString(friendsXML.content, {mergeAttrs : true, explicitArray : false} ,function (err, result) {
			users = result['MediaContainer']['User'];
		});

		xml2js.parseString(accountXML.content, {mergeAttrs : true, explicitArray : false} ,function (err, result) {
			admintitle = result['user']['title'].toLowerCase();
		});

		var friendsList = [];

		for (var i = 0; i < users.length; i++) {
		 	friendsList.push( users[i].title.toLowerCase() );
		}

    //Add admin username to the list
    friendsList.push(admintitle);

    return (isInArray(plexUsername.toLowerCase(), friendsList));
  }
})

