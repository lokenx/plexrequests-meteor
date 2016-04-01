Meteor.methods({
  getBranch: function () {
    return "master";
  },
  getVersion: function () {
    return "1.8.6";
  },
  checkForUpdate : function () {
    var branch = Meteor.call('getBranch');
    var currentVersion = Meteor.call('getVersion');

    try {
        var latestJson = HTTP.call("GET","https://api.github.com/repos/lokenx/plexrequests-meteor/contents/version.txt?ref=" + branch,{headers: {"User-Agent": "Meteor/1.1"}});
    }
    catch (err) {
        logger.log("Error checking for update: " + err);
        return false;
    }

    var latestJson64 = latestJson['data']['content'];
    var latestVersion64 = new Buffer(latestJson64, "base64").toString();
    var latestVersion = latestVersion64.slice(0, - 1);

    if (latestVersion > currentVersion) {
      logger.info("New update available");
      return true;
    } else {
      return false
    }
  }
});
