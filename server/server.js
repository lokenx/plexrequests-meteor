Meteor.methods({
    'addMovie' : function (movie, id) {
        Movies.insert({
            title: movie,
            imdb: id,
            createdAt: new Date()
        });
    },
    'pushBullet' : function (movie) {
        var pbAPI = "abcdefg12345";
        Meteor.http.call("POST", "https://api.pushbullet.com/v2/pushes",
                         {auth: pbAPI + ":",
                          params: {"type": "note", "title": "Plex Requests", "body": movie}
                         });
    }
});