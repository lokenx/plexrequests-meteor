// Define Mongodb Collections

Movies = new Mongo.Collection("movies");
TV = new Mongo.Collection("tv");
Settings = new Mongo.Collection("settings");

// Movies Collection Schema

var movies = new SimpleSchema (
  {
	title: {
    type: String,
    label: "Movie title",
    max: 200
  },
  id: {
    type: Number,
    label: "TheMovieDB ID"
  },
  imdb: {
    type: String,
    label: "IMDB ID",
    unique: true
  },
  released: {
    type: Date,
    label: "Release date"
  },
  user: {
    type: String,
    label: "Requesting user"
  },
  downloaded: {
  	type: Boolean,
  	label: "Status of downlaoded content"
  },
  createdAt: {
  	type: Number,
  	label: "Date of request",
    autoValue: function() {
      if ( this.isInsert ) {
        return Date.now();
      }
    }
  },
  approved: {
  	type: Boolean,
  	label: "Approval status"
  },
  poster_path: {
    type: String,
    label: "Poster URL"
  },
  issues: {
    type: [String],
    label: "Reported issues",
    optional: true
  }
});

// TV Collection Schema

var tv = new SimpleSchema (
  {
	title: {
    type: String,
    label: "TV Show title",
    max: 200
  },
  id: {
    type: Number,
    label: "TheMovieDB ID"
  },
  tvdb: {
    type: Number,
    label: "TVDB ID",
    min: 0
  },
  released: {
    type: Date,
    label: "Release date"
  },
  user: {
    type: String,
    label: "Requesting user"
  },
  "status.downloaded": {
    type: Number,
    label: "Number of downloaded episodes"
  },
  "status.total": {
    type: Number,
    label: "Number of total episodes"
  },
  createdAt: {
  	type: Number,
  	label: "Date of request",
    autoValue: function() {
      if ( this.isInsert ) {
        return Date.now();
      }
    }
  },
  approved: {
  	type: Boolean,
  	label: "Approval status"
  },
  poster_path: {
    type: String,
    label: "Poster URL"
  },
  issues: {
    type: [String],
    label: "Reported issues",
    optional: true
  },
  episodes: {
    type: Boolean,
    label: "Whether to download all or new episodes only",
    optional: true
  }
});

// Settings Collection Schema

var settings = new SimpleSchema ({
  /**
   * GENERAL
   */
  searchOptionsMOVIES: {
    type: Boolean,
    label: "Search for Movies",
    defaultValue: true,
    optional: true
  },
  searchOptionsTV: {
    type: Boolean,
    label: "Search for TV Shows",
    defaultValue: true,
    optional: true
  },
  approval: {
    type: Boolean,
    label: "Require approval of requests",
    defaultValue: false,
    optional: true
  },
  weeklyLimit: {
    type: Number,
    label: "Weekly user request limit",
    defaultValue: 5,
    optional: true
  },

  /**
   * PLEX
   */
  plexAuthenticationTOKEN: {
    type: String,
    label: "Plex authorization token",
    defaultValue: "abcd1234",
    optional: true
  },
  plexAuthenticationENABLED: {
    type: Boolean,
    label: "Enable user authentication",
    defaultValue: false,
    optional: true
  },
  plexAuthenticationPASSWORDS: {
    type: Boolean,
    label: "Require users to login with their passwords",
    defaultValue: false,
    optional: true
  },
  plexBannedUSERS: {
    type: String,
    label: "List of users to deny login access",
    defaultValue: "",
    optional: true
  },

  /**
   * COUCHPOTATO
   */
  couchPotatoURL: {
    type: String,
    label: "Couch Potato server IP or Hostname",
    defaultValue: "192.168.0.1",
    optional: true
  },
  couchPotatoPORT: {
    type: Number,
    label: "Couch Potato server port",
    defaultValue: 5050,
    optional: true
  },
  couchPotatoSSL: {
    type: Boolean,
    label: "Enable Couch Potato SSL",
    defaultValue: false,
    optional: true
  },
  couchPotatoAPI: {
    type: String,
    label: "Couch Potato API key",
    defaultValue: "abcd1234",
    optional: true
  },
  couchPotatoDIRECTORY: {
    type: String,
    label: "Couch Potato sub-directory",
    defaultValue: "",
    optional: true
  },
  couchPotatoENABLED: {
    type: Boolean,
    label: "Enable CouchPotato",
    defaultValue: false,
    optional: true
  },

  /**
   * SICKRAGE
   */
  sickRageURL: {
    type: String,
    label: "SickRage server IP or Hostname",
    defaultValue: "192.168.0.1",
    optional: true
  },
  sickRagePORT: {
    type: Number,
    label: "SickRage server port",
    defaultValue: 8081,
    optional: true
  },
  sickRageSSL: {
    type: Boolean,
    label: "Enable SickRage SSL",
    defaultValue: false,
    optional: true
  },
  sickRageAPI: {
    type: String,
    label: "SickRage API key",
    defaultValue: "abcd1234",
    optional: true
  },
  sickRageDIRECTORY: {
    type: String,
    label: "SickRage sub-directory",
    defaultValue: "",
    optional: true
  },
  sickRageENABLED: {
    type: Boolean,
    label: "Enable SickRage",
    defaultValue: false,
    optional: true
  },

  /**
   * SONARR
   */
  sonarrURL: {
    type: String,
    label: "Sonarr server IP or Hostname",
    defaultValue: "192.168.0.1",
    optional: true
  },
  sonarrPORT: {
    type: Number,
    label: "Sonarr server port",
    defaultValue: 8989,
    optional: true
  },
  sonarrSSL: {
    type: Boolean,
    label: "Enable Sonarr SSL",
    defaultValue: false,
    optional: true
  },
  sonarrAPI: {
    type: String,
    label: "Sonarr API key",
    defaultValue: "abcd1234",
    optional: true
  },
  sonarrDIRECTORY: {
    type: String,
    label: "Sonarr sub-directory",
    defaultValue: "",
    optional: true
  },
  sonarrQUALITYPROFILEID: {
    type: Number,
    label: "Download quality profile",
    defaultValue: 1,
    optional: true
  },
  sonarrROOTFOLDERPATH: {
    type: String,
    label: "Root save directory for TV shows",
    defaultValue: "/path/to/root/tv/folder",
    optional: true
  },
  sonarrSEASONFOLDERS: {
    type: Boolean,
    label: "Enable season folders",
    defaultValue: true,
    optional: true
  },
  sonarrENABLED: {
    type: Boolean,
    label: "Enable Sonarr",
    defaultValue: false,
    optional: true
  },
customNotificationTEXT: {
      type: String,
      label: "Custom Notification Message",
      defaultValue: "<title> requested by <user>",
      optional: true
  },
  customNotificationTITLE: {
      type: String,
      label: "Custom Notification Title",
      defaultValue: "Plex Requests <type>",
      optional: true
  },
  notificationErrorTEXT: {
      type: String,
      defaultValue: "<title> Issues: <issue> (<user>)"
  },
  notificationErrorTitle: {
      type: String,
      defaultValue: "Plex Requests <type> Issue"
  },
  /**
   * PUSHBULLET
   */
  pushbulletAPI: {
    type: String,
    label: "Pushbullet API key",
    defaultValue: "abcd1234",
    optional: true
  },
  pushbulletChannel: {
    type: String,
    label: "Pushbullet Channel Tag",
    defaultValue: "",
    optional: true
  },
  pushbulletENABLED: {
    type: Boolean,
    label: "Enable Pushbullet notifications",
    defaultValue: false,
    optional: true
  },

  /**
   * PUSHOVER
   */
  pushoverAPI: {
    type: String,
    label: "Pushover API key",
    defaultValue: "abcd1234",
    optional: true
  },
  pushoverUSER: {
    type: String,
    label: "Pushover user key",
    defaultValue: "abcd1234",
    optional: true
  },
  pushoverENABLED: {
    type: Boolean,
    label: "Enable Pushover notifications",
    defaultValue: false,
    optional: true
  },

  /**
   * SLACK
   */
  slackAPI: {
    type: String,
    label: "Slack webhook url",
    defaultValue: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
    optional: true
  },
  slackUsername: {
    type: String,
    label: "Slack Username",
    defaultValue: "",
    optional: true
  },
  slackChannel: {
    type: String,
    label: "Slack Channel",
    defaultValue: "",
    optional: true
  },
  slackENABLED: {
    type: Boolean,
    label: "Enable Slack notifications",
    defaultValue: false,
    optional: true
  }
});

// Set Collection Schemas

TV.attachSchema(tv);
Movies.attachSchema(movies);
Settings.attachSchema(settings);
