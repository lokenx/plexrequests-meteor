Meteor.methods({
    'addMovie' : function(movie){
        Movies.insert({
            text: movie,
            createdAt: new Date()
        })
    },
    'pushBullet' : function(movie){
        var pbAPI = "abcdefg12345"
        Meteor.http.call("POST", "https://api.pushbullet.com/v2/pushes",
                         {auth: pbAPI + ":",
                          params: {"type": "note", "title": "Plex Requests", "body": movie}
                         })
    }
})