Meteor.publish('movies', function (){
    return Movies.find({});
});

Meteor.publish('settings', function () {
    if(this.userId) return Settings.find({_id: "couchpotatosetting"});
});


Houston.add_collection(Settings);
Houston.add_collection(Movies);

if (!(Settings.findOne({_id: "couchpotatosetting"}))) {
    Settings.insert({
        _id: "couchpotatosetting",
        service: "CouchPotato",
        api: "http://192.168.0.1:5050/api/abcdef0123456789/",
        enabled: false
    });
};
//I am using the default settings, but it is a little confusing since its not really an API, only a plex toekn but did not want to create a whole new collection for Plex
//Users do not need to sign into to get thier token, it can be found this way... maybe we let thme know that? https://support.plex.tv/hc/en-us/articles/204059436-Finding-your-account-token-X-Plex-Token
if (!(Settings.findOne({_id: "plexsetting"}))) {
    Settings.insert({
        _id: "plexsetting",
        service: "Plex",
		api: "Plex Token",
        enabled: false
    });
};

if (!(Settings.findOne({_id: "pushbulletsetting"}))) {
    Settings.insert({
        _id: "pushbulletsetting",
        service: "PushBullet",
        api: "abcdef0123456789",
        enabled: false
    });
};

Meteor.methods({
    'pushBullet' : function (movie) {        
	    var MessageTitle = "Plex Request";	
	    if(Settings.findOne({_id:"plexsetting"}).enabled) {
			if (Settings.findOne({_id:"plexsetting"}).plexuser) { var whosubmit = Settings.findOne({_id:"plexsetting"}).plexuser; } else {  var whosubmit = Settings.findOne({_id:"plexsetting"}).admin; }
			var MessageTitle = "Plex Request By " + whosubmit;			  
	    } 
		
		if (Settings.findOne({_id:"pushbulletsetting"}).enabled) {
            var pbAPI = Settings.findOne({_id:"pushbulletsetting"}).api;
            Meteor.http.call("POST", "https://api.pushbullet.com/v2/pushes",
                             {auth: pbAPI + ":",
                              params: {"type": "note", "title": MessageTitle, "body": movie}
                             });
        }
    },
    'searchCP' : function (id, movie) {
        if (Settings.findOne({_id:"couchpotatosetting"}).enabled) {
            var cpAPI = Settings.findOne({_id:"couchpotatosetting"}).api;

            //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
            //But it's possible there's nothing much I can do
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            var imdb = id;
            
            try {
                var status = Meteor.http.call("GET", cpAPI  + "app.available", {timeout:5000});
            }
            catch (error) {
                console.log(error)
            }

            var initSearch = Meteor.http.call("GET", cpAPI  + "media.get/", {params: {"id": imdb}});

            if (initSearch['data']['media'] === null) {
                //Movie is not in CP
                Meteor.http.call("POST", cpAPI  + "movie.add/", {params: {"identifier": imdb}});
                var postAdd = Meteor.http.call("GET", cpAPI  + "media.get/", {params: {"id": imdb}});
                var json = JSON.parse(postAdd.content);
                var movie = json['media']['title'];
                var released = json['media']['info']['released'];
                Movies.insert({
                    title: movie,
                    imdb: imdb,
                    released: released,
                    downloaded: false,
                    createdAt: new Date()
                });
                return "added"
            } else if (initSearch['data']['media']['status'] === "active") {
                //Movie is on the wanted list already
                var json = JSON.parse(initSearch.content);
                var id = json['media']['info']['imdb'];
                if (Movies.findOne({imdb: id}) === undefined) {
                    var movie = json['media']['title'];
                    var released = json['media']['info']['released'];
                    Movies.insert({
                        title: movie,
                        imdb: id,
                        released: released,
                        downloaded: false,
                        createdAt: new Date()
                    });
                }
                return "active";
            } else if (initSearch['data']['media']['status'] === "done") {
                //Movie is downloaded already
                var json = JSON.parse(initSearch.content);
                var id = json['media']['info']['imdb'];
                if (Movies.findOne({imdb: id}) !== undefined) {
                    Movies.update({imdb: id}, {$set: {downloaded: true}});
                }
                return "downloaded";
            }
        } else {
            //CP not being used so just add to list of requested movies
            Movies.insert({
                    title: movie,
                    imdb: id,
                    released: "",
                    downloaded: false,
                    createdAt: new Date()
            });
            return "added";
        };
    },
    'updateCP' : function () {
        if (Settings.findOne({_id:"couchpotatosetting"}).enabled) {
            var allMovies = Movies.find({downloaded: false});
            allMovies.forEach(function (movie) {
                Meteor.call('searchCP', movie.imdb, movie.title);
            });
        };
    },
    'checkCP' : function () {
        var cpAPI = Settings.findOne({_id:"couchpotatosetting"}).api;
        var status = Meteor.http.call("GET", cpAPI  + "app.available", {timeout:5000});

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        return (status['data']['success']);

    },
    'checkCPEnabled' : function () {
        return Settings.findOne({_id:"couchpotatosetting"}).enabled;
    },
    'checkPlexEnabled' : function () {
        return Settings.findOne({_id:"plexsetting"}).enabled;
    },
    'PlexLogin' : function (pUsername,pPassword) {

		//clean password and username for authentication.
		function authHeaderVal(username, password) {
		    var authString = username + ':' + password;
		    var buffer = new Buffer(authString.toString(), 'binary');
		    return 'Basic ' + buffer.toString('base64');
		}

		//Likely do not need all the X-Plex headers, I think the only manditory one is X-Plex-Client-Identifier
	    var plexstatus = Meteor.http.call("POST", "https://plex.tv/users/sign_in.xml",{
            headers: {
                'Authorization': authHeaderVal(pUsername, pPassword),
                'X-Plex-Client-Identifier': 'Request_Users',
                'X-Plex-Product': 'App',
                'X-Plex-Version': '1.0',
                'X-Plex-Device': 'App',
                'X-Plex-Platform': 'Meteor',
                'X-Plex-Platform-Version': '1.0',
                'X-Plex-Provides': 'controller'
           }
        });
        
        //Need more testing for actual errors when password or username are wrong to let the admin user know...
        //Bad authentication comes back as 401, will need to add error handles, for now it just assumes that and lets user know
        if (plexstatus.statusCode==201) {
                //prase package https://github.com/peerlibrary/meteor-xml2js
            var results = xml2js.parseStringSync(plexstatus.content);
            var plexAuth = results.user.$.authenticationToken;
            //Now also sets variable of admin username for checkPlexUser below
            //As well as return the username so it can be set as persistent storage so admin doesn't need to login to admin interface
                Settings.update({_id: "plexsetting" }, {$set: {api: plexAuth, enabled: true, admin: pUsername }});
                return pUsername;
        } else {
            return false;
        }
    },
    'checkPlexUser' : function (plexUsername) {

			function isInArray(value, array) {
			  return array.indexOf(value) > -1;
			}

			var plexToken = Settings.findOne({_id:"plexsetting"}).api;

			var friendsXML = Meteor.http.call("GET", "https://plex.tv/pms/friends/all?X-Plex-Token="+plexToken);

			var friendsJSON = xml2js.parseStringSync(friendsXML.content);

			//There is likely a cleaner way to pull out just the users names for the array
			var friendsList = [];

			//console.dir(friendsJSON.MediaContainer.User);
			var users = friendsJSON.MediaContainer.User;

			   for(var i=0;i<users.length;i++){
			        friendsList.push(users[i].$.title);//Using title instead of username since managed users do not have a username: https://plex.tv/pms/friends/all
			    }
            //Add admin username to the list
            friendsList.push(Settings.findOne({_id:"plexsetting"}).admin);
			Settings.update({_id: "plexsetting" }, {$set: {plexuser: plexUsername }});
            return (isInArray(plexUsername, friendsList));
    }

});
