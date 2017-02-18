Meteor.methods({
  settingsUpdate: function () {
    var settings = Settings.find().fetch()[0];
    //set Couch Potato on start-up
    CouchPotato.url = (settings.couchPotatoSSL) ? "https://" + settings.couchPotatoURL : "http://" + settings.couchPotatoURL;
    CouchPotato.port = settings.couchPotatoPORT;
    CouchPotato.api = settings.couchPotatoAPI;
    CouchPotato.directory = settings.couchPotatoDIRECTORY || "";

    //set SickRage on start-up
    SickRage.url = (settings.sickRageSSL) ? "https://" + settings.sickRageURL : "http://" + settings.sickRageURL;
    SickRage.port = settings.sickRagePORT;
    SickRage.api = settings.sickRageAPI;
    SickRage.directory = settings.sickRageDIRECTORY || "";

    //set Sonarr on start-up
    Sonarr.url = (settings.sonarrSSL) ? "https://" + settings.sonarrURL : "http://" + settings.sonarrURL;
    Sonarr.port = settings.sonarrPORT;
    Sonarr.api = settings.sonarrAPI;
    Sonarr.directory = settings.sonarrDIRECTORY || "";

    //set Radarr on start-up
    Radarr.url = (settings.radarrSSL) ? "https://" + settings.radarrURL : "http://" + settings.radarrURL;
    Radarr.port = settings.radarrPORT;
    Radarr.api = settings.radarrAPI;
    Radarr.directory = settings.radarrDIRECTORY || "";
  },
  userCount : function () {
    return Meteor.users.find({}).count();
  }
});
