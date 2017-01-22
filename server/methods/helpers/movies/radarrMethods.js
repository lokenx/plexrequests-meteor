Meteor.methods({
    radarrProfilesGet: function() {
        try {
            check(Radarr.url, String);
            check(Radarr.port, Number);
            check(Radarr.api, String);
        } catch (e) {
            console.log("Radarr Profiles Get -> " + e.message);
            return [];
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        var allProfiles;
        try {
            allProfiles = HTTP.get(Radarr.url + ":" + Radarr.port + Radarr.directory + "/api/profile", {headers: {"X-Api-Key":Radarr.api}, timeout: 15000} );
        } catch (e) {
            console.log("Radarr Profiles Get -> " + e.message);
            return [];
        }

        return _.map(allProfiles.data, function (profile) {
            return {
                id: profile.id,
                name: profile.name
            };
        });
    },
    
  radarrMovieAdd: function(tmdbId, title, qualityProfileId, rootFolderPath) {
    try {
      check(Radarr.url, String);
      check(Radarr.port, Number);
      check(Radarr.api, String);

      check(title, String);
      check(tmdbId, Number);
      check(qualityProfileId, Number);
      check(rootFolderPath, String);

    } catch (e) {
      console.log("Radarr Movie Post -> " + e.message);
      return false;
    }
    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    var options = {"searchForMovie": 'true'};
    try {
      var response = HTTP.post(Radarr.url + ":" + Radarr.port + Radarr.directory + "/api/movie", {headers: {"X-Api-Key":Radarr.api},
        data: {
          "title": title,
          "tmdbId": tmdbId,
          "qualityProfileId": qualityProfileId,
          "rootFolderPath": rootFolderPath,
          "titleSlug": title,
          "monitored": 'true',
          "images": [],
          "addOptions": options
        }, timeout: 15000}
      );
    } catch (e) {
      console.log("Radarr Movie Post -> " + e.message);
      return false;
    }

    return !!response.data
  },

radarrSystemStatus: function() {
    try {
        check(Radarr.url, String);
        check(Radarr.port, Number);
        check(Radarr.api, String);
    } catch (e) {
        console.log("Radarr Status -> " + e.message);
        return false;
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
        var response = HTTP.get(Radarr.url + ":" + Radarr.port + Radarr.directory + "/api/system/status", {headers: {"X-Api-Key":Radarr.api}, timeout: 15000} );
    } catch (e) {
        console.log("Radarr Status -> " + e.message);
        return false;
    }


    return !!(response.data);
},
radarrMovieGet: function(tmdbId) {
    try {
        check(Radarr.url, String);
        check(Radarr.port, Number);
        check(Radarr.api, String);
        check(tmdbId, Number);
    } catch (e) {
        console.log("Radarr Movie Get -> " + e.message);
        return false;
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
        var allMovies = HTTP.get(Radarr.url + ":" + Radarr.port + Radarr.directory + "/api/movie", {headers: {"X-Api-Key":Radarr.api}, timeout: 15000} );
    } catch (e) {
        console.log("Radarr Movie Get -> " + e.message);
        return false;
    }

    var status = false;

    _.each(allMovies.data, function (movie) {
        if (movie.tmdbid === tmdbId) {
            status = true;
        }
    });

    return status
},
    radarrMovieStats: function(tmdbId) {
        try {
            check(Radarr.url, String);
            check(Radarr.port, Number);
            check(Radarr.api, String);
            check(tvdb, Number);
        } catch (e) {
            console.log("Radarr Movie Stats -> " + e.message);
            return false;
        }

        //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
        //But it's possible there's nothing much I can do
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        try {
            var allShows = HTTP.get(Radarr.url + ":" + Radarr.port + Radarr.directory + "/api/series/", {headers: {"X-Api-Key":Radarr.api}, timeout: 15000} );
        } catch (e) {
            console.log("Radarr Movie Stats -> " + e.message);
            return false;
        }

        var radarrId ;

        _.each(allShows.data, function (show) {
            if (show.tmdbid === tmdbId) {
                radarrId = show.id;
            }
        });

        try {
            var response = HTTP.get(Radarr.url + ":" + Radarr.port + Radarr.directory + "/api/series/" + radarrId, {headers: {"X-Api-Key":Radarr.api}, timeout: 15000} );
        } catch (e) {
            if (e.message.indexOf("NotFound") > -1) {
                return {"downloaded" : 0, "total" : 0};
            } else {
                console.log("Radarr Movie Stats Individual Movie Info -> " + e.message);
                console.log("Movie TMDB: " + tmdbId);
                return false;
            }
        }

        return {"downloaded" : response.data.episodeFileCount, "total" : response.data.episodeCount};
    },
});

