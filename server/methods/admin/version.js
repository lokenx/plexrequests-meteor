Meteor.methods({
    getBranch: function () {
        return "master";
    },

    getVersion: function () {
        // parse the version.txt file and return the contents
        var fs = Npm.require('fs');
        return 'v' + fs.readFileSync(process.env.PWD + '/version.txt','utf8');
    },

    checkForUpdate : function () {
        var currentVersion = Meteor.call('getVersion');
        // Only the master branch is versioned and has tagged releases
        if (Meteor.call('getBranch') === "master") {
            try {
                var latestJson = HTTP.call("GET", "https://api.github.com/repos/lokenx/plexrequests-meteor/releases/latest", {headers: {"User-Agent": "Plexrequests/" + currentVersion}});
            }
            catch (err) {
                logger.info("Error checking for update: " + err);
                return false;
            }

            return (latestJson.data.tag_name !== currentVersion);
        }
    }
});
