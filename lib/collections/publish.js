if (Meteor.isServer) {
	Meteor.publish('settings', function () {
    if(this.userId) return Settings.find();
	});
    
    Meteor.publish('permissions', function () {
    if(this.userId) return Permissions.find();
	});

	Meteor.publish('movies', function () {
		if (this.userId) {
			return Movies.find({});
		} else {
			return Movies.find({});
		}
	})

	Meteor.publish("tv", function(){
		if (this.userId) {
			return TV.find({});
		} else {
			return TV.find({});
		}
	});
	Permissions.allow({
    	update: function () {
      		return true;
		}
  	});
};
