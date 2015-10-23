SyncedCron.add({
    name: 'Update CouchPotato download status',
    schedule: function(parser) {
        return parser.text('every 1 hour');
        },
    job: function() {
        Meteor.call('updateCP');
        return 'Updating CouchPotato download status';
    }
});

SyncedCron.start();
