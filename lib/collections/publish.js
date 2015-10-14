if (Meteor.isServer) {
	Meteor.publish('settings', function () {
    if(this.userId) return Settings.find();
	});

	Meteor.publish('movies', function () {
		if (this.userId) {
			return Movies.find();
		} else {
			return Movies.find({}, {fields: {user: 0}});
		}
	})
};