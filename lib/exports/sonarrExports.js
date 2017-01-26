function Server() {
  this.url = "http://192.168.0.1";
  this.port = 8989;
  this.api = "abcdef012345";
  this.directory = "";
}

Sonarr = new Server();

Sonarr.systemStatus = function() {
  return Meteor.call("systemStatus", {});
}

Sonarr.profilesGet = function() {
  return Meteor.call("profilesGet", {});
}

Sonarr.seriesStats = function(tvdb) {
  return Meteor.call("seriesStats", tvdb, {});
}

Sonarr.seriesGet = function(tvdb) {
  return Meteor.call("seriesGet", tvdb, {});
}

Sonarr.seriesDelete = function(tvdb) {
  return Meteor.call("seriesDelete", tvdb, {});
}

Sonarr.seriesPost = function(tvdb, title, qualityProfileId, seasonFolder, rootFolderPath, episodes) {
  return Meteor.call("seriesPost", tvdb, title, qualityProfileId, seasonFolder, rootFolderPath, episodes, {});
}
