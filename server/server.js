Meteor.publish('movies', function (){
    return Movies.find({});
});

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
        var pbAPI = "abcdef0123456789"; 
        Meteor.http.call("POST", "https://api.pushbullet.com/v2/pushes",
                         {auth: pbAPI + ":",
                          params: {"type": "note", "title": "Plex Requests", "body": movie}
                         });
    },
    'searchCP' : function (id) {
        var cpAPI = "http://yourcpip:5050/api/abcdef0123456789/";
        
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
    },
    'updateCP' : function () {
        var allMovies = Movies.find({downloaded: false});
        allMovies.forEach(function (movie) {
            Meteor.call('searchCP', movie.imdb);
        });
    }
});
