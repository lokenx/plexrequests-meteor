Template.requests.helpers({
	'poster_path' : function () {
		var poster = (this.poster_path !== "/") ? "http://image.tmdb.org/t/p/w154" + this.poster_path : "poster-placeholder.png";
    return poster;
  },
  'release_date' : function () {
  	return moment(this.released).format('MMMM Do, YYYY');
  },
  'approval_status' : function () {
  	var approval = (this.approved) ? '<i class="fa fa-check success-icon"></i>': '<i class="fa fa-times error-icon"></i>';
  	return approval;
  },
  'download_status' : function () {
  	//Movie true/false
  	var approval;
  	if (this.imdb) {
  		approval = (this.downloaded) ? '<i class="fa fa-check success-icon"></i>': '<i class="fa fa-times error-icon"></i>';  		
  	} else {
  		//TV dowloaded:total
  	}
  	return approval;
  },
  'requesting_user' : function () {
  	if (Meteor.user()) {
  		return "<li><strong>User:</strong> " + this.user + "</li>";
  	}
  }
});

Template.requests.events({
	'click .approve-item' : function (event, template) {
		Meteor.call("approveRequest", this, function(error, result) {
			if (error || !(result)) {
				//Alert error
				console.log(error);
			} else {
				// Alert success
			}
		});
	},
	'click .delete-item' : function (event, template) {
		if (window.confirm("Are you sure you want to delete " + this.title + "?")) {
			Meteor.call("deleteRequest", this, function(error, result) {
				if (error || !(result)) {
					//Alert error
					console.log(error);
				} else {
					// Alert success with undo option
				}
			});
		}
	},
	'click .issue-select' : function (event, template) {
		var issue = event.target.text;
		Meteor.call("addIssue", this, issue, function(error, result) {
			if (error || !(result)) {
				//Alert error
				console.log(error);
			} else {
				// Alert success
			}
		})
	}
})