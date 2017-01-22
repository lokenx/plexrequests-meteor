Meteor.methods({
  profilesGet: function() {
    try {
      check(Sonarr.url, String);
      check(Sonarr.port, Number);
      check(Sonarr.api, String);
    } catch (e) {
      console.log("Sonarr Profiles Get -> " + e.message);
      return [];
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    var allProfiles;
    try {
      allProfiles = HTTP.call("GET", Sonarr.url + ":" + Sonarr.port + Sonarr.directory + "/api/profile", {headers: {"X-Api-Key":Sonarr.api}, timeout: 15000} );
    } catch (e) {
      console.log("Sonarr Profiles Get -> " + e.message);
      return [];
    }

    return _.map(allProfiles.data, function (profile) {
      return {
        id: profile.id,
        name: profile.name,
      };
    });
  },
  seriesDelete: function(tvdb) {
    try {
      check(Sonarr.url, String);
      check(Sonarr.port, Number);
      check(Sonarr.api, String);
      check(tvdb, Number);
    } catch (e) {
      console.log("Sonarr Series Delete -> " + e.message);
      return false;
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      var allShows = HTTP.call("GET", Sonarr.url + ":" + Sonarr.port + Sonarr.directory + "/api/series/", {headers: {"X-Api-Key":Sonarr.api}, timeout: 15000} );
    } catch (e) {
      console.log("Sonarr Series Delete -> " + e.message);
      return false;
    }

    var sonarrId = 0;

    _.each(allShows.data, function (show) {
      if (show.tvdbId === tvdb) {
        sonarrId = show.id;
      }
    });


    if (sonarrId !== 0) {
      try {
        var response = HTTP.call("DELETE", Sonarr.url + ":" + Sonarr.port + Sonarr.directory + "/api/series/" + sonarrId, {headers: {"X-Api-Key":Sonarr.api}, timeout: 2000} );
      } catch (e) {
        console.log("Sonarr Series Delete -> " + e.message);
        return false;
      }
    }

    var status = (response) ? true : false;

    return status;
  },
  seriesGet: function(tvdb) {
    try {
      check(Sonarr.url, String);
      check(Sonarr.port, Number);
      check(Sonarr.api, String);
      check(tvdb, Number);
    } catch (e) {
      console.log("Sonarr Series Get -> " + e.message);
      return false;
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      var allShows = HTTP.call("GET", Sonarr.url + ":" + Sonarr.port + Sonarr.directory + "/api/series/", {headers: {"X-Api-Key":Sonarr.api}, timeout: 15000} );
    } catch (e) {
      console.log("Sonarr Series Get -> " + e.message);
      return false;
    }

    var status = false;

    _.each(allShows.data, function (show) {
      if (show.tvdbId === tvdb) {
        status = true;
      }
    });

    return status
  },
  seriesPost: function(tvdb, title, qualityProfileId, seasonFolder, rootFolderPath, episodes) {
    try {
      check(Sonarr.url, String);
      check(Sonarr.port, Number);
      check(Sonarr.api, String);

      check(tvdb, Number);
      check(title, String);
      check(qualityProfileId, Number);
      check(seasonFolder, Boolean);
      check(rootFolderPath, String);
      check(episodes, Boolean);

    } catch (e) {
      console.log("Sonarr Series Post -> " + e.message);
      return false;
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    var options = [];
    if (episodes === false) {
      options = ({
        "ignoreEpisodesWithFiles": true,
        "ignoreEpisodesWithoutFiles": true,
        "searchForMissingEpisodes": false
      });
    } else {
      options = ({
        "ignoreEpisodesWithFiles": false,
        "ignoreEpisodesWithoutFiles": false,
        "searchForMissingEpisodes": true
      });
    }

    try {
      var response = HTTP.call("POST", Sonarr.url + ":" + Sonarr.port + Sonarr.directory + "/api/series/", {headers: {"X-Api-Key":Sonarr.api},
        data: {
          "tvdbId":tvdb,
          "title":title,
          "qualityProfileId":qualityProfileId,
          "seasons":[],
          "seasonFolder":seasonFolder,
          "rootFolderPath":rootFolderPath,
          "addOptions":options,
          "images":[]
        }, timeout: 15000}
      );
    } catch (e) {
      console.log("Sonarr Series Post -> " + e.message);
      return false;
    }

    return !!response.data
  },
  seriesStats: function(tvdb) {
    try {
      check(Sonarr.url, String);
      check(Sonarr.port, Number);
      check(Sonarr.api, String);
      check(tvdb, Number);
    } catch (e) {
      console.log("Sonarr Series Stats -> " + e.message);
      return false;
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      var allShows = HTTP.call("GET", Sonarr.url + ":" + Sonarr.port + Sonarr.directory + "/api/series/", {headers: {"X-Api-Key":Sonarr.api}, timeout: 15000} );
    } catch (e) {
      console.log("Sonarr Series Stats -> " + e.message);
      return false;
    }

    var sonarrId ;

    _.each(allShows.data, function (show) {
      if (show.tvdbId === tvdb) {
        sonarrId = show.id;
      }
    });

    try {
      var response = HTTP.call("GET", Sonarr.url + ":" + Sonarr.port + Sonarr.directory + "/api/series/" + sonarrId, {headers: {"X-Api-Key":Sonarr.api}, timeout: 15000} );
    } catch (e) {
      if (e.message.indexOf("NotFound") > -1) {
        return {"downloaded" : 0, "total" : 0};
      } else {
        console.log("Sonarr Series Stats Individual Show Info -> " + e.message);
        console.log("Show TVDB: " + tvdb);
        return false;
      }
    }

    return {"downloaded" : response.data.episodeFileCount, "total" : response.data.episodeCount};
  },
  systemStatus: function() {
    try {
      check(Sonarr.url, String);
      check(Sonarr.port, Number);
      check(Sonarr.api, String);
    } catch (e) {
      console.log("Sonarr Status -> " + e.message);
      return false;
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      var response = HTTP.call("GET", Sonarr.url + ":" + Sonarr.port + Sonarr.directory + "/api/system/status", {headers: {"X-Api-Key":Sonarr.api}, timeout: 15000} );
    } catch (e) {
      console.log("Sonarr Status -> " + e.message);
      return false;
    }

    var status = (response.data) ? true : false;
    return status;
  }
});
