function Server() {
    this.url = "http://192.168.0.1";
    this.port = 8989;
    this.api = "abcdef012345";
    this.directory = "";
}

Radarr = new Server();

Radarr.radarrSystemStatus = function() {
    return Meteor.call("radarrSystemStatus", {});
};

Radarr.radarrProfilesGet = function() {
    return Meteor.call("radarrProfilesGet", {});
};

Radarr.radarrMovieStats = function(id) {
    return Meteor.call("radarrMovieStats", id, {});
};

Radarr.radarrMovieGet = function(id) {
    return Meteor.call("radarrMovieGet",  id, {});
};

// Radarr.seriesDelete = function(tmdbId) {
//     return Meteor.call("radarrMovieDelete", tmdbId, {});
// };

Radarr.radarrMovieAdd = function(id, title, qualityProfileId, rootFolderPath) {
    return Meteor.call("radarrMovieAdd", id, title, qualityProfileId, rootFolderPath, {});
};
