Template.requests.onCreated(function () {
  scroll();

  Session.set("searchOptions", []);

  var instance = this;
  instance.searchType = new ReactiveVar();

  Meteor.call("searchOptions", function (error, result) {
    if (result.length !== 0) {
      Session.set("searchOptions", result);
      instance.searchType.set((Session.get("searchOptions")[0]));
    } else {
      Session.set("searchDisabled", true);
      instance.searchType.set("none");
    }
  });

  this.filter = new ReactiveVar("All Requests");
  this.sort = new ReactiveVar("Newest First");

  // Loading requests on demand
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
        switch (selectedFilter) {
          case "Approved":
            filter = {approval_status: 1};
            break;
          case "Not Approved":
            filter = {approval_status: 0};
            break;
          case "Downloaded":
            filter = {downloaded: true};
            break;
          case "Not Downloaded":
            filter = {downloaded: false};
            break;
          case "Denied":
            filter = {approval_status: 2};
            break;
          case "Has Issues":
            filter = {'issues.0': {$exists: true}};
            break;
          default:
            filter = {};
        }
      }
      return Movies.find(filter, {sort: sort, skip: 0, limit: instance.loaded.get()});
    } else {
      if (selectedFilter !== "All Requests") {
        switch (selectedFilter) {
          case "Approved":
            filter = {approval_status: 1};
            break;
          case "Not Approved":
            filter = {approval_status: 0};
            break;
          case "Downloaded":
            filter = {"status.downloaded": {$gt: 0}};
            break;
          case "Not Downloaded":
            filter = {"status.downloaded": {$lt: 1}};
            break;
          case "Denied":
            filter = {approval_status: 2};
            break;
          case "Has Issues":
            filter = {'issues.0': {$exists: true}};
            break;
          default:
            filter = {};
        }
      }
      return TV.find(filter, {sort: sort, skip: 0, limit: instance.loaded.get()});
    }
  }
});

Template.requests.helpers({
  'poster_path' : function () {
    if ((typeof this.poster_path === 'undefined') | (this.poster_path === "/")) {
      return "poster-placeholder.png";
    } else {
            var s_poster_path = this.poster_path.replace("http:", "https:");
      return s_poster_path;
    }

  },

  'episodes' : function () {
    if (this.episodes){
      return "All Episodes";
    } else {
      return "New Episodes";
    }
    
  },

  'link' : function () {
    var link = 'http://tvmaze.com/shows/' + this.id + '/' + this.title;
    return link;
  },
  'year' : function () {
    return moment(this.released).format('YYYY');
  },
  'release_date' : function () {
    return moment(this.released).format('MMMM Do, YYYY');
  },
  'created_at': function () {
    return moment(this.createdAt).format('MMMM Do, YYYY');
  },
  'approved_show' : function () {
    switch(this.approval_status) {
    case 0:
      return true;
      break;
    case 1:
      return false;
      break;
    case 2:
      return true;
      break;
    default:
      console.error("Approval integer out of range")
    }
  },
  'denied_show' : function () {
    switch(this.approval_status) {
    case 0:
      return true;
      break;
    case 1:
      return false;
      break;
    case 2:
      return false;
      break;
    default:
      console.error("Approval integer out of range")
    }
  },
  'approval_status' : function () {
  
    var approval;

    switch(this.approval_status) {
      case 0:
        approval = '<strong>Approved:</strong> <i class="fa fa-times error-icon"></i>';
          break;
      case 1:
        approval = '<strong>Approved:</strong> <i class="fa fa-check success-icon"></i>';
          break;
      case 2:
        approval = '<strong>Denied:</strong> <font color="#db524b">' + this.denied_reason + '</font></i>';
        break;
      default:
        console.error("Approval integer out of range")
    }

      return approval;
  },
  'download_status' : function () {
    //Movie true/false
    var approval;
    if (this.imdb) {
      approval = (this.downloaded) ? '<i class="fa fa-check success-icon"></i>': '<i class="fa fa-times error-icon"></i>';
    } else {
      //TV dowloaded:total
      if (typeof this.status !== "undefined") {
        approval = this.status.downloaded + " / " + this.status.total;
      } else {
        approval = "0 / 0";
      }
    }
    return approval;
  },
  'available': function () {
    if (this.imdb) {
      return (this.downloaded) ? true : false;
    }
    else {
      return;
    }
  },
  'requesting_user' : function () {
    if (Meteor.user()) {
      return "<li><strong>User:</strong> " + this.user + "</li>";
    }
  },
  'season_count' : function () {
    var count;  
    if (this.seasons !== -1) {
          count = this.seasons
      } else {
         count = "N/A" 
      }
    return count
  },
  'searchOptions': function () {
    return Session.get("searchOptions");
  },
  'activeSearch' : function () {
    return (Template.instance().searchType.get().length === this.length);
  },
  'filterOptions' : function () {
    return [{filter: "All Requests"}, {filter: "Approved"}, {filter: "Not Approved"},{filter: "Downloaded"}, {filter: "Not Downloaded"}, {filter: "Denied"}, {filter: "Has Issues"}]
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
  },
  'searchType': function (type) {
    return Template.instance().searchType.get() === type;
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
        console.error("Error approving, please check server logs");
        Bert.alert("Unable to approve " + title +", please try again!", "danger");
      } else {
        // Alert success
        Bert.alert("Approved " + title +"!", "success");
      }
    });
  },
  'click .deny-item' : function (event, template) {
    //Set Model values and Show
    $('#denyModelID').text(this._id);
    $('#denyModelTitle').text(this.title);
    $('#denyModel').modal('show');
  },
  'click .deny-confirm' : function (event, template) {
    
    //Get values
    var id = $('#denyModelID').text();
    var reason = $('#denyModelReason').val();
    var title = $('#denyModelTitle').text();
    
    //Hide the model
    $('#denyModel').modal('hide');
    
    //Deny all
    if(id == "ALL") {
      Meteor.call("denyAll", reason, function(error, result) {
        if (error || !(result)) {
          //Alert error
          console.error("Error denying, please check server logs");
          Bert.alert("Unable to deny all, please try again!", "danger");
        } else {
          // Alert success
          Bert.alert("Denied all!", "success");
        }
      });
    }
    //Deny Request
    else {
      Meteor.call("denyRequest", id, reason, function(error, result) {
        if (error || !(result)) {
          //Alert error
          console.error("Error denying, please check server logs");
          Bert.alert("Unable to deny " + title +", please try again!", "danger");
        } else {
          // Alert success
          Bert.alert("Denied " + title +"!", "success");
        }
      });
    }
  },
  'click .delete-item' : function (event, template) {
    if (window.confirm("Are you sure you want to delete " + this.title + "?")) {
      Meteor.call("deleteRequest", this, function(error, result) {
        if (error || !(result)) {
          //Alert error
          console.error(error);
        } else {
          // Alert success with undo option
        }
      });
    }
  },
  'click .issue-select' : function (event, template) {
    var issue = event.target.text;
    var request = this;
    request.user = Session.get("user");
    Meteor.call("addIssue", request, issue, function(error, result) {
      if (error || !(result)) {
        //Alert error
        Bert.alert("Error adding an issue, or it already exists. Please try again!", "danger");
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
        console.error(error);
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
  },
  'click .return-to-top': function (event, instance) {
    $('body,html').animate({
        scrollTop : 0
    }, 500);
    return false;
  },
  'click #approveAll': function (event) {
    event.preventDefault();

    Meteor.call("approveAll", function (error, result) {
      if (error) {
        Bert.alert(error.reason, "danger");
      } else if (!result) {
        Bert.alert("An error occured, check server logs", "danger");
      } else {
        Bert.alert("Approved all requests!", "success");
      }
    })
  },
  'click #denyAll': function (event) {
    event.preventDefault();
    
    //Set values
    $('#denyModelID').text("ALL");
    $('#denyModelTitle').text("Deny All");
    $('#denyModel').modal('show');
  },
  'click .go-to-top': function () {
    $('body').animate({ scrollTop: 0 }, "slow")
  },
  'click .mark-available': function (event, template) {
    var movie = this;
    Meteor.call('markAvailability', movie, true, function(error, res) {

      if (error) {
        console.error(error);
        Bert.alert("Error marking as available, please try again!", "danger");
      }
      Bert.alert(movie.title + " marked as available!", "success");
    })
  },
  'click .mark-unavailable': function (event, template) {
    var movie = this;
    Meteor.call('markAvailability', movie, false, function(error, res) {

      if (error) {
        console.error(error);
        Bert.alert("Error marking as unavailable, please try again!", "danger");
      }
      Bert.alert(movie.title + " marked as unavailable!", "success");
    })
  }
});

var scroll = function () {
  $(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
      $('.load-more').trigger('click');
    }
  });
};
