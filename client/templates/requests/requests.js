Template.requests.onCreated(function () {
	Session.set("searchOptions", []);
  this.searchType = new ReactiveVar("Movies");

	Meteor.call("searchOptions", function (error, result) {
    if (result.length !== 0) {
      Session.set("searchOptions", result);
    } else {
      Session.set("searchDisabled", true);
    }
  });

});

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
  },
  "searchOptions": function () {
    return Session.get("searchOptions");
	},
	'activeSearch' : function () {
    return (Template.instance().searchType.get().length === this.length);
  },
  'requests' : function () {
  	if (Template.instance().searchType.get() === "Movies") {
			return Movies.find({}, {sort: {createdAt:-1}});
  	} else {
  		return TV.find();
  	}
  }
});

Template.requests.events({
	'click .search-selector a' : function (event, template) {
    var type = $(event.target).text();
    template.searchType.set(type);
  },
	'click .approve-item' : function (event, template) {
		var title = this.title;
		Meteor.call("approveRequest", this, function(error, result) {
			if (error || !(result)) {
				//Alert error
				console.log(error);
				console.log(result);
				Bert.alert("Unable to approve " + title +", please try again!", "danger");
			} else {
				// Alert success
				Bert.alert("Approved " + title +"!", "success");
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
				Bert.alert("Error adding an issue, please try again!", "danger");
				console.log(error);
			} else {
				// Alert success
				Bert.alert("Added issue successfully!", "success");
			}
		})
	},
	'click .clear-issues' : function (event, template) {
		Meteor.call("clearIssues", this, function (error, result) {
			if (error || !(result)) {
				//Alert error
				console.log(error);
				Bert.alert("Error clearing issues, please try again!", "danger");
			} else {
				// Alert success
				Bert.alert("Cleared issues successfully", "success");
			}
		})
	}
})
