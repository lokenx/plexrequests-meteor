Meteor.startup(function () {
  //creating a global PMS object
  var PlexAPI = Meteor.npmRequire('plex-api');
  var settings = Settings.find().fetch()[0];
  PlexServer = new PlexAPI(settings.plexServerIP);
});
