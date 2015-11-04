Meteor.methods({
  getBranch: function () {
    return "sub-directory";
  },
  checkForUpdate : function () {
    var branch = Meteor.call('getBranch');
    var currentVersion = "0.6.17";

    try {
        var latestJson = HTTP.call("GET","https://api.github.com/repos/lokenx/plexrequests-meteor/contents/version.txt?ref=" + branch,{headers: {"User-Agent": "Meteor/1.1"}});
    }
    catch (err) {
        console.log(err);
        return false;
    }

    var latestJson64 = latestJson['data']['content'];
    var latestVersion64 = new Buffer(latestJson64, "base64").toString();
    var latestVersion = latestVersion64.slice(0, - 1);

    if (latestVersion > currentVersion) {
        return true;
    } else {
      return false
    }
  }
});