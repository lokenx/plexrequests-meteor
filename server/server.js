Meteor.publish('movies', function (){
    return Movies.find({});
});

Meteor.publish('tv', function (){
    return TV.find({});
});

Meteor.publish('cpapi', function () {
    if(this.userId) return Settings.find({_id: "couchpotatosetting"});
});


Houston.add_collection(Settings);
Houston.add_collection(Movies);
Houston.add_collection(TV);


if (!(Settings.findOne({_id: "couchpotatosetting"}))) {
    Settings.insert({
        _id: "couchpotatosetting",
        service: "CouchPotato",
        api: "http://192.168.0.1:5050/api/abcdef0123456789/",
        enabled: false
    });
};

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

if (!(Settings.findOne({_id: "sickragesetting"}))) {
    Settings.insert({
        _id: "sickragesetting",
        service: "SickRage",
        api: "http://192.168.0.1:8081/api/abcdef0123456789/",
        enabled: false
    });
};

Meteor.methods({
    'pushBullet' : function (movie, year, puser) {
        if (Settings.findOne({_id:"pushbulletsetting"}).enabled) {
            var pbAPI = Settings.findOne({_id:"pushbulletsetting"}).api;
            Meteor.http.call("POST", "https://api.pushbullet.com/v2/pushes",
                             {auth: pbAPI + ":",
                              params: {"type": "note", "title": "Plex Requests by " + puser, "body": movie + " (" + year + ")"}
                             });
        }
    },
    'searchCP' : function (id, imdb, movie, year, puser) {
        if (Settings.findOne({_id:"couchpotatosetting"}).enabled) {
            var cpAPI = Settings.findOne({_id:"couchpotatosetting"}).api;

            //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
            //But it's possible there's nothing much I can do
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
                //var postAdd = Meteor.http.call("GET", cpAPI  + "media.get/", {params: {"id": imdb}});
                //var json = JSON.parse(postAdd.content);
                //var movie = json['media']['title'];
                //var released = json['media']['info']['released'];
                Movies.insert({
                    title: movie,
                    id: id,
                    imdb: imdb,
                    released: year,
                    user: puser,
                    downloaded: false,
                    createdAt: new Date()
                });
                return "added"
            } else if (initSearch['data']['media']['status'] === "active") {
                //Movie is on the wanted list already
                //var json = JSON.parse(initSearch.content);
                //var id = json['media']['info']['imdb'];
                if (Movies.findOne({imdb: imdb}) === undefined) {
                    //var movie = json['media']['title'];
                    //var released = json['media']['info']['released'];
                    Movies.insert({
                        title: movie,
                        id: id,
                        imdb: imdb,
                        released: year,
                        user: puser,
                        downloaded: false,
                        createdAt: new Date()
                    });
                }
                return "active";
            } else if (initSearch['data']['media']['status'] === "done") {
                //Movie is downloaded already
                //var json = JSON.parse(initSearch.content);
                //var id = json['media']['info']['imdb'];
                if (Movies.findOne({imdb: imdb}) !== undefined) {
                    Movies.update({imdb: imdb}, {$set: {downloaded: true}});
                }
                return "downloaded";
            }
        } else {
            //CP not being used so just add to list of requested movies
            Movies.insert({
                    title: movie,
                    id: id,
                    imdb: imdb,
                    released: year,
                    user: puser,
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
                Meteor.call('searchCP', movie.id, movie.imdb, movie.title, movie.released);
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
                Settings.update({_id: "plexsetting" }, {$set: {api: plexAuth, enabled: true}});
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

			try {
                var friendsXML = Meteor.http.call("GET", "https://plex.tv/pms/friends/all?X-Plex-Token="+plexToken);
                var accountXML = Meteor.http.call("GET", "https://plex.tv/users/account?X-Plex-Token="+plexToken);
            } catch (error) {
                console.log(error);
                return error;
            }

			xml2js.parseString(friendsXML.content, {mergeAttrs : true, explicitArray : false} ,function (err, result) {
			   		users = result['MediaContainer']['User'];
			});

			xml2js.parseString(accountXML.content, {mergeAttrs : true, explicitArray : false} ,function (err, result) {
			   		admintitle = result['user']['title'].toLowerCase();
			});

			//There is likely a cleaner way to pull out just the users names for the array
			var friendsList = [];

			for (var i = 0, len = users.length; i < len; i++) {
			 	friendsList.push( users[i].title.toLowerCase() );
			}

            //Add admin username to the list
            friendsList.push(admintitle);

            return (isInArray(plexUsername.toLowerCase(), friendsList));
    },
    'checkPlex' : function() {
        var plexToken = Settings.findOne({_id:"plexsetting"}).api;

        try {
            var friendsXML = Meteor.http.call("GET", "https://plex.tv/pms/friends/all?X-Plex-Token="+plexToken);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }

    },
    'searchSickRage' : function(id, tvdb, title, year, puser) {
        //Check if SickRage service is enabled
        if (Settings.findOne({_id:"sickragesetting"}).enabled){

            //If enabled check if can connect to it
            var srAPI = Settings.findOne({_id:"sickragesetting"}).api;

            //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
            //But it's possible there's nothing much I can do
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

            try {
                var status = Meteor.http.call("GET", srAPI  + "?cmd=sb.ping", {timeout:5000});
            }
            catch (error) {
                //If can't connect error out
                console.log(error)
                return "error";
            }
            //If can connect see if series is in DB already
            if (Meteor.http.call("GET", srAPI + "?cmd=show&tvdbid=" + id)['data']['result'] === "failure") {
                //If not in DB add to DB
                var sickRageAdd = Meteor.http.call("GET", srAPI  + "?cmd=show.addnew&tvdbid=" + id + "&status=wanted");

                if (sickRageAdd['data']['result'] === "success") {
                    TV.insert({
                        title: title,
                        id: id,
                        tvdb: tvdb,
                        released: year,
                        user: puser,
                        downloaded: false,
                        createdAt: new Date()
                    });
                    return "added";
                } else {
                    return "error"
                }
            } else if (Meteor.http.call("GET", srAPI + "?cmd=show&tvdbid=" + id)['data']['result'] === "success") {
                //If in DB let user know
                return "downloaded";
            } else {
                return "error";
            }

        } else {
        //If not enabled add to requests lists
            TV.insert({
                title: title,
                id: id,
                tvdb: tvdb,
                released: year,
                user: puser,
                downloaded: false,
                createdAt: new Date()
            });
            return "added";
        }

    }

});
