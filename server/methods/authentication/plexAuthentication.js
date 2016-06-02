Meteor.methods({
	'checkPlexAuthentication' : function () {
		return Settings.find({}).fetch()[0].plexAuthenticationENABLED;
	},
	'checkPlexAuthenticationPasswords' : function () {
		return Settings.find({}).fetch()[0].plexAuthenticationPASSWORDS;
	},
	'checkPlexUser' : function (plexUsername, plexPassword) {

		if (Settings.find({}).fetch()[0].plexAuthenticationPASSWORDS) {
			// If passwords are required check full login

			function authHeaderVal(username, password) {
		    var authString = username + ':' + password;
		    var buffer = new Buffer(authString.toString(), 'binary');
		    return 'Basic ' + buffer.toString('base64');
			}

			var headers = {
				'Authorization': authHeaderVal(plexUsername, plexPassword),
				'X-Plex-Client-Identifier': 'BGZQ8N25FYP3UHB6',
				'X-Plex-Version': '1.2.0',
				'X-Plex-Platform': 'Meteor',
				'X-Plex-Device-Name': 'Plex Requests'
			};

			try {
				Meteor.http.call("POST", "https://plex.tv/users/sign_in.json", {headers: headers});
			} catch (error) {
				logger.warn(plexUsername + " failed to login");
				throw new Meteor.Error(401, JSON.parse(error.message.substring(13)).error);
			}
		}

		function isInArray(value, array) {
		  return array.indexOf(value) > -1;
		}

		function checkArray(value, array) {
		  return array.indexOf(value);
		}
		
		//Update users in permissions
		Meteor.call("permissionsUpdateUsers");
		
		//Get friendslist and bannedlist
		var friendsList = Meteor.call("getPlexFriendlist");
		var bannedList = Permissions.find({permBANNED: true}, {fields: {_id: 0, permUSER: 1, permBANNED: 1}}).fetch();
		
		//Remove banned users
		for(var i = 0; i < bannedList.length; i++) {
			friendsList.splice(friendsList.indexOf(bannedList[i].permUSER), 1);
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
					'X-Plex-Client-Identifier': 'BGZQ8N25FYP3UHB6',
					'X-Plex-Version': '1.2.0',
					'X-Plex-Platform': 'Meteor',
					'X-Plex-Device-Name': 'Plex Requests'
				}
			});
		} catch (error) {
			var response = xml2js.parseStringSync(error.response.content);
			logger.error(response.errors.error[0]);
			throw new Meteor.Error(401, response.errors.error[0])
		}


		//Bad authentication comes back as 401, will need to add error handles, for now it just assumes that and lets user know
		if (plexstatus.statusCode==201) {
		  var results = xml2js.parseStringSync(plexstatus.content);
		  var plexAuth = results.user.$.authenticationToken;
		  Settings.update({}, {$set: {plexAuthenticationTOKEN: plexAuth}});
				return true;
		} else {
				logger.error("Error getting Plex token");
				return false;
			}
		},
	'getPlexFriendlist' : function () {
		var plexToken = Settings.find({}).fetch()[0].plexAuthenticationTOKEN;

		try {
		  var friendsXML = Meteor.http.call("GET", "https://plex.tv/pms/friends/all?X-Plex-Token="+plexToken);
		  var accountXML = Meteor.http.call("GET", "https://plex.tv/users/account?X-Plex-Token="+plexToken);
		} catch (error) {
		  logger.error("Error checking Plex Users: " + error.message);
		  return false;
		}

		var users = [];
		var admintitle = '';

		xml2js.parseString(friendsXML.content, {mergeAttrs : true, explicitArray : false} ,function (err, result) {
			users = result['MediaContainer']['User'];
		});

		xml2js.parseString(accountXML.content, {mergeAttrs : true, explicitArray : false} ,function (err, result) {
			admintitle = result['user']['title'].toLowerCase();
		});

		var friendsList = [];

		// Check if an array of users or a single user is returned
		if (typeof users !== 'undefined'){
			if (users.length) {
				for (var i = 0; i < users.length; i++) {
					friendsList.push( users[i].title.toLowerCase() );
				}
			} else if (users.title) {
				friendsList.push( users.title.toLowerCase() );
				}	  
		}

		//Add admin username to the list
		friendsList.push(admintitle);

		return(friendsList);
	}
});
