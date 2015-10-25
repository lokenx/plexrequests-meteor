Meteor.methods({
  settingsUpdate: function () {
    var settings = Settings.find().fetch()[0];
    //set Couch Potato on start-up
    CouchPotato.url = (settings.couchPotatoSSL) ? "https://" + settings.couchPotatoURL : "http://" + settings.couchPotatoURL;
    CouchPotato.port = settings.couchPotatoPORT;
    CouchPotato.api = settings.couchPotatoAPI;

    //set SickRage on start-up
    SickRage.url = (settings.sickRageSSL) ? "https://" + settings.sickRageURL : "http://" + settings.sickRageURL;
    SickRage.port = settings.sickRagePORT
    SickRage.api = settings.sickRageAPI

    //set Sonarr on start-up
    Sonarr.url = (settings.sonarrSSL) ? "https://" + settings.sonarrURL : "http://" + settings.sonarrURL;
    Sonarr.port = settings.sonarrPORT
    Sonarr.api = settings.sonarrAPI   
  }
});
