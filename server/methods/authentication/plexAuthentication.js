Meteor.methods({
	'checkPlexAuthentication' : function () {
		return Settings.find({}).fetch()[0].plexAuthenticationENABLED;
	},
	'checkPlexUser' : function (plexUsername) {

		function isInArray(value, array) {
		  return array.indexOf(value) > -1;
		}

		function checkArray(value, array) {
		  return array.indexOf(value);
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

		// Remove banned users
		var banned = Settings.find().fetch()[0].plexBannedUSERS;
		if (banned) {
			var bannedArray = banned.split(",");
			for (var i = 0; i < bannedArray.length; i++) {
				var checkBanned = checkArray(bannedArray[i], friendsList);
				if ( checkBanned > -1) {
					friendsList.splice(checkBanned, 1);
				}
			}
		}

    return (isInArray(plexUsername.toLowerCase(), friendsList));
  },
	'getPlexToken' : function (username,password) {

		//clean password and username for authentication.
		function authHeaderVal(username, password) {
	    var authString = username + ':' + password;
	    var buffer = new Buffer(authString.toString(), 'binary');
	    return 'Basic ' + buffer.toString('base64');
		}

		try {
			var plexstatus = Meteor.http.call("POST", "https://plex.tv/users/sign_in.xml", {
	      headers: {
		      'Authorization': authHeaderVal(username, password),
		      'X-Plex-Client-Identifier': 'Request_Users',
		      'X-Plex-Product': 'App',
		      'X-Plex-Version': '1.0',
		      'X-Plex-Device': 'App',
		      'X-Plex-Platform': 'Meteor',
		      'X-Plex-Platform-Version': '1.0',
		      'X-Plex-Provides': 'controller'
				}
			});
		} catch (error) {
			var response = xml2js.parseStringSync(error.response.content);
			throw new Meteor.Error(401, response.errors.error[0])
		}


    //Bad authentication comes back as 401, will need to add error handles, for now it just assumes that and lets user know
    if (plexstatus.statusCode==201) {
      var results = xml2js.parseStringSync(plexstatus.content);
      var plexAuth = results.user.$.authenticationToken;
      Settings.update({}, {$set: {plexAuthenticationTOKEN: plexAuth}});
			return true;
    } else {
			return false;
		}
	}
});
