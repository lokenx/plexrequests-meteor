if (Meteor.isServer) {
	Meteor.publish('settings', function () {
    if(this.userId) return Settings.find();
	});
};