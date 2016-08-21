SyncedCron.config({
  log: false
});

SyncedCron.add({
    name: "Update download status",
    schedule: function(parser) {
        return parser.text('every 1 hour');
        },
    job: function() {
        Meteor.call('updateCP');
        Meteor.call('updateSickRage');
        Meteor.call('updateSonarr');
        logger.info('Updating download status');
        return true;
    }
});

SyncedCron.start();
