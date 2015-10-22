Template.search.onCreated(function () {
  this.results = new ReactiveVar();
  this.error = new ReactiveVar(false);
  this.searching = new ReactiveVar(false);
  this.searchType = new ReactiveVar("Movies");
  Session.set("searchOptions", []);
  Session.set("searchDisabled", false);

  Meteor.call("searchOptions", function (error, result) {
    if (result.length !== 0) {
      Session.set("searchOptions", result);
    } else {
      Session.set("searchDisabled", true);
    }
  });

});

Template.search.helpers({
	"searchOptions": function () {
    return Session.get("searchOptions");
	},
  "firstSearchOption": function () {
    return Session.get("searchOptions")[0];
  },
  "searchDisabled": function () {
    if (Session.get("searchDisabled") == true) {
      return "disabled";
    }
  },
	"error": function () {
		return Template.instance().error.get();
	},
	"searching": function () {
		return Template.instance().searching.get();
	},
	"searchType": function () {
		return Template.instance().searchType.get();
	},
	'results': function () {
    return Template.instance().results.get();
  },
  'activeSearch' : function () {
    return (Template.instance().searchType.get().length === this.length);
  }
});

Template.search.events({
  'click .search-selector a' : function (event, template) {
    var type = $(event.target).text();
    template.searchType.set(type);
    template.results.set([]);
    $('#search-input').trigger('keyup');
  },
  'keyup  #search-input': _.throttle(function (event, template) {
    template.results.set([]);

    var searchterm = $(event.target).val().trim();
    var searchType = template.searchType.get();
    var results = [];

    if (searchterm.length > 2) {
      template.searching.set(true);
      template.error.set(false);
      Meteor.call("searchContent", searchterm, searchType, function (error, result) {
        if (error) {
          console.log(error);
          template.searching.set(false);
          template.error.set(true);
        } else if (result.length) {
          template.searching.set(false);
          template.results.set(result);
        } else {
          template.searching.set(false);
          template.error.set(true);
        }
      });
    }
  }, 1000),
  'submit #search-form': function (event) {
    return false;
  },
  'click .add-request': function (event) {
    var btn = $(event.target);
    var requestTitle = this.title;

    btn.html('<i class="fa fa-spinner fa-spin"></i> &nbsp; Requesting...');
    if (this.media_type === "movie") {
      Meteor.call("requestMovie", {id: this.id, title: this.title, released: this.release_date, poster_path: this.poster_path, user: "jdoe"}, function (error, result) {
        if (error || result === false) {
          console.log("Error requesting, check server log");
          btn.html('<i class="fa fa-plus"></i> &nbsp; Request');
          Bert.alert("Couldn't submit request, please try again!", "danger");
        } else if (result === true) {
          Bert.alert("Successfully requested " + requestTitle + "!", "success");
          btn.hide();
        } else if (result === "limit") {
          Bert.alert("You've exceeded your weekly limit!", "warning");
          btn.html('<i class="fa fa-plus"></i> &nbsp; Request');
        }
      })
    }

  }
});
