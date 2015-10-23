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

	this.filter = new ReactiveVar("All Requests");
	this.sort = new ReactiveVar("Newest First");

	// Loading requests on demand

	var instance = this;
	instance.loaded = new ReactiveVar(0);
	instance.limit = new ReactiveVar(10);

	instance.autorun(function () {
		var subscription = instance.subscribe('movies', limit);
		var limit = instance.limit.get();

		if (subscription.ready()) {
			instance.loaded.set(limit);
		} else {
			// Subscription is not ready yet
		}
	});

	instance.requests = function() {
		var selectedFilter = instance.filter.get();
		var filter = {};
		var selectedSort = instance.sort.get();
		var sort = (selectedSort === "Newest First") ? {createdAt: -1} : {createdAt: 1};

  	if (instance.searchType.get() === "Movies") {
			if (selectedFilter !== "All Requests") {
				filter = (selectedFilter === "Approved") ? {approved: true} : {downloaded: true};
			}
			return Movies.find(filter, {sort: sort, skip: 0, limit: instance.loaded.get()});
  	} else {
  		return TV.find();
  	}
	}
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
	'filterOptions' : function () {
		return [{filter: "All Requests"}, {filter: "Approved"}, {filter: "Downloaded"}]
	},
	'activeFilter' : function () {
		return (Template.instance().filter.get() == this.filter) ? '<i class="fa fa-check"></i> ' : "";
	},
	'sortOptions' : function () {
		return [{sort: "Newest First"}, {sort: "Oldest First"}]
	},
	'activeSort' : function () {
		return (Template.instance().sort.get() == this.sort) ? '<i class="fa fa-check"></i> ' : "";
	},
  'requests': function () {
    return Template.instance().requests();
  },
  'hasMoreRequests': function () {
    return Template.instance().requests().count() >= Template.instance().limit.get();
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
	},
	'click .filter-select' : function (event, template) {
		var filter = event.target.text;
		template.filter.set(filter);
		return false;
	},
	'click .sort-select' : function (event, template) {
		var sort = event.target.text;
		template.sort.set(sort);
		return false;
	},
	'click .load-more': function (event, instance) {
    var limit = instance.limit.get();
    limit += 10;
    instance.limit.set(limit);
		return false;
  }
})
