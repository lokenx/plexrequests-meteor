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
        var cpAPI = "http://yourcpip:5050/api/abcdef0123456789/" + "media.get/";
        var cp = Meteor.http.call("GET", cpAPI,
                                    {params: {"id": id}
                                    });        
        if (cp['data']['media'] == null) { 
            console.log("Media " + id + " not in CP database");            
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
