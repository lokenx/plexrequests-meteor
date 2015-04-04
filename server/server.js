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

if (!(Settings.findOne({_id: "pushbulletsetting"}))) {
    Settings.insert({
        _id: "pushbulletsetting",
        service: "PushBullet",
        api: "abcdef0123456789",
        enabled: false
    });
};

Meteor.methods({
    'addMovie' : function (movie, id) {
        Movies.insert({
            title: movie,
            imdb: id,
            downloaded: false,
            createdAt: new Date(),
            downloadedAt: false
        });
    },
    'pushBullet' : function (movie) {
        if (Settings.findOne({_id:"pushbulletsetting"}).enabled) {
            var pbAPI = Settings.findOne({_id:"pushbulletsetting"}).api; 
            Meteor.http.call("POST", "https://api.pushbullet.com/v2/pushes",
                             {auth: pbAPI + ":",
                              params: {"type": "note", "title": "Plex Requests", "body": movie}
                             });
        }
    },
    'searchCP' : function (id) {
        if (Settings.findOne({_id:"couchpotatosetting"}).enabled) {
            var cpAPI = Settings.findOne({_id:"couchpotatosetting"}).api;

            //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
            //But it's possible there's nothing much I can do
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

            var cp = Meteor.http.call("GET", cpAPI  + "media.get/",
                                        {params: {"id": id}
                                        });        
            if (cp['data']['media'] === null) { 
                Meteor.http.call("POST", cpAPI  + "movie.add/",
                                        {params: {"identifier": id}
                                        });
            } else if (cp['data']['media']['status'] === "done") {
                Movies.update({imdb: id}, {
                    $set: {downloaded: true}});
            };
        }
    },
    'updateCP' : function () {
        if (Settings.findOne({_id:"couchpotatosetting"}).enabled) {
            var allMovies = Movies.find({downloaded: false});
            allMovies.forEach(function (movie) {
                Meteor.call('searchCP', movie.imdb);
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
        
    }
});
