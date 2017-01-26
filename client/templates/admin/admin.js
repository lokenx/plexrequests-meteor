AutoForm.hooks({
  updateGeneralSettingsForm: {
    onSuccess: function(formType, result) {
      if (result) {
        Bert.alert('Updated successfully', 'success');
        Meteor.call("settingsUpdate");
      }
      this.event.preventDefault();
      return false;
    },
    onError: function(formType, error) {
      console.error(error);
      Bert.alert('Update failed, please try again', 'danger');
    }
  },
  updateAuthenticationSettingsForm: {
    onSuccess: function(formType, result) {
      if (result) {
        Bert.alert('Updated successfully', 'success');
        Meteor.call("settingsUpdate");
      }
      this.event.preventDefault();
      return false;
    },
    onError: function(formType, error) {
      console.error(error);
      Bert.alert('Update failed, please try again', 'danger');
    }
  },
  updateCouchPotatoSettingsForm: {
    onSuccess: function(formType, result) {
      if (result) {
        Bert.alert('Updated successfully', 'success');
        Meteor.call("settingsUpdate");
      }
      this.event.preventDefault();
      return false;
    },
    onError: function(formType, error) {
      console.error(error);
      Bert.alert('Update failed, please try again', 'danger');
    }
  },
  updateSickRageSettingsForm: {
    onSuccess: function(formType, result) {
      if (result) {
        Bert.alert('Updated successfully', 'success');
        Meteor.call("settingsUpdate");
      }
      this.event.preventDefault();
      return false;
    },
    onError: function(formType, error) {
      console.error(error);
      Bert.alert('Update failed, please try again', 'danger');
    }
  },
  updateSonarrSettingsForm: {
    onSuccess: function(formType, result) {
      if (result) {
        Bert.alert('Updated successfully', 'success');
        Meteor.call("settingsUpdate");
      }
      this.event.preventDefault();
      return false;
    },
    onError: function(formType, error) {
      console.error(error);
      Bert.alert('Update failed, please try again', 'danger');
    }
  },
  updateRadarrSettingsForm: {
      onSuccess: function(formType, result) {
          if (result) {
              Bert.alert('Updated successfully', 'success');
              Meteor.call("settingsUpdate");
          }
          this.event.preventDefault();
          return false;
      },
      onError: function(formType, error) {
          console.error(error);
          Bert.alert('Update failed, please try again', 'danger');
      }
  },
  updateNotificationsSettingsForm: {
    onSuccess: function(formType, result) {
      if (result) {
        Bert.alert('Updated successfully', 'success');
        Meteor.call("settingsUpdate");
      }
      this.event.preventDefault();
      return false;
    },
    onError: function(formType, error) {
      console.error(error);
      Bert.alert('Update failed, please try again', 'danger');
    }
  }
});

Template.admin.helpers({
  settings: function(){
    return Settings.findOne({});
  },
  branch: function () {
    return Template.instance().branch.get();
  },
  sonarrProfiles: function () {
    return Template.instance().sonarrProfiles.get().map(function (profile) {
      return {
        label: profile.name,
        value: profile.id
      };
    });
  },
  radarrProfiles: function () {
      return Template.instance().radarrProfiles.get().map(function (profile) {
          return {
              label: profile.name,
              value: profile.id
          };
      });
  },
  version: function () {
    return Template.instance().version.get();
  },
  update: function () {
    return Template.instance().update.get();
  },
  latestVersion: function () {
    return Template.instance().latestVersion.get();
  },
  latestNotes: function () {
    return Template.instance().latestNotes.get();
  },
  previousVersion: function () {
    return Template.instance().previousVersion.get();
  },
  previousNotes: function () {
    return Template.instance().previousNotes.get();
  },
  permissionUser: function () {
  return Permissions.find({}).fetch();
  },
  makeUniqueID: function () {
    return "update-each-" + this._id;
  }
});

Template.admin.onCreated(function(){
  var instance = this;
  instance.branch = new ReactiveVar("");
  instance.version = new ReactiveVar("");
  instance.update = new ReactiveVar(false);
  instance.sonarrProfiles = new ReactiveVar([]);
  instance.radarrProfiles = new ReactiveVar([]);
  instance.latestVersion = new ReactiveVar("");
  instance.latestNotes = new ReactiveVar("");
  instance.previousVersion = new ReactiveVar("");
  instance.previousNotes = new ReactiveVar("");

  Meteor.call("getBranch", function (error, result) {
    if (result) {
      instance.branch.set(result);
    }
  });

  Meteor.call("getVersion", function (error, result) {
    if (result) {
      instance.version.set(result);
    }
  });

  Meteor.call("checkForUpdate", function (error, result) {
    if (result) {
      instance.update.set(result)
    }
  });

  HTTP.get('https://api.github.com/repos/lokenx/plexrequests-meteor/releases', function (error, result) {
    if (error) {
      console.error('Error retrieving release notes: ' + error)
    }
    instance.latestVersion.set(result.data[0].name);
    var notesArray = result.data[0].body.split("- ");
    instance.latestNotes.set(notesArray.filter(Boolean));

    instance.previousVersion.set(result.data[1].name);
    notesArray = result.data[1].body.split("- ");
    instance.previousNotes.set(notesArray.filter(Boolean));
  });
});

Template.admin.events({
  'click .list-group-item' : function (event) {
    var target = $(event.target);
    
  //Update permissions collection
  if(target.text() == "Users") {
    Meteor.call("permissionsUpdateUsers");
  }
    
    $('.list-group-item').removeClass("active");
    target.toggleClass("active");

    $('.settings-pane').hide();
    $('#Settings' + target.text()).show();
  },

  'submit #updateSettingsForm' : function (event) {
    event.preventDefault();
    return false;
  },

  'click #usersSettingsSubmit' : function (event) {
    event.preventDefault();
  
  try {
    $('*[id^="update-each-"]').submit();
    Bert.alert('Updated successfully', 'success');
  }
  catch(error) {
    console.error(error);
    Bert.alert('Update failed, please try again', 'danger');
  }
  },

  'click #couchPotatoTest' : function (event) {
    event.preventDefault();
    var btn = $(event.target);
    btn.html("Testing... <i class='fa fa-spin fa-refresh'></i>").removeClass().addClass("btn btn-info-outline");
    Meteor.call("testCouchPotato", function (error, result) {
      if (error || !result) {
        btn.removeClass("btn-info-outline").addClass("btn-danger-outline");
        btn.html("Error!");
      } else {
        btn.removeClass("btn-info-outline").addClass("btn-success-outline");
        btn.html("Success!");
      }
    })
  },

  'click #sickRageTest' : function (event) {
    event.preventDefault();
    var btn = $(event.target);
    btn.html("Testing... <i class='fa fa-spin fa-refresh'></i>").removeClass().addClass("btn btn-info-outline");
    Meteor.call("testSickRage", function (error, result) {
      if (error || !result) {
        btn.removeClass("btn-info-outline").addClass("btn-danger-outline");
        btn.html("Error!");
      } else {
        btn.removeClass("btn-info-outline").addClass("btn-success-outline");
        btn.html("Success!");
      }
    })
  },

  'click #sonarrTest' : function (event) {
    event.preventDefault();
    var btn = $(event.target);
    btn.html("Testing... <i class='fa fa-spin fa-refresh'></i>").removeClass().addClass("btn btn-info-outline");
    Meteor.call("testSonarr", function (error, result) {
      if (error || !result) {
        btn.removeClass("btn-info-outline").addClass("btn-danger-outline");
        btn.html("Error!");
      } else {
        btn.removeClass("btn-info-outline").addClass("btn-success-outline");
        btn.html("Success!");
      }
    })
  },

  'click #radarrTest' : function (event) {
      event.preventDefault();
      var btn = $(event.target);
      btn.html("Testing... <i class='fa fa-spin fa-refresh'></i>").removeClass().addClass("btn btn-info-outline");
      Meteor.call("testRadarr", function (error, result) {
          if (error || !result) {
              btn.removeClass("btn-info-outline").addClass("btn-danger-outline");
              btn.html("Error!");
          } else {
              btn.removeClass("btn-info-outline").addClass("btn-success-outline");
              btn.html("Success!");
          }
      })
  },

  'click #iftttTest' : function (event) {
    event.preventDefault();
    var btn = $(event.target);
    btn.html("Testing... <i class='fa fa-spin fa-refresh'></i>").removeClass().addClass("btn btn-info-outline");
    Meteor.call("testIFTTT", function (error, result) {
      if (error || !result) {
        btn.removeClass("btn-info-outline").addClass("btn-danger-outline");
        btn.html("Error!");
        Bert.alert(error.reason, "danger");
      } else if (result) {
        btn.removeClass("btn-info-outline").addClass("btn-success-outline");
        btn.html("Success!");
      }
    })
  },

  'click #pushbulletTest' : function (event) {
    event.preventDefault();
    var btn = $(event.target);
    btn.html("Testing... <i class='fa fa-spin fa-refresh'></i>").removeClass().addClass("btn btn-info-outline");
    Meteor.call("testPushbulllet", function (error, result) {
      if (error || !result) {
        btn.removeClass("btn-info-outline").addClass("btn-danger-outline");
        btn.html("Error!");
        Bert.alert(error.reason, "danger");
      } else if (result) {
        btn.removeClass("btn-info-outline").addClass("btn-success-outline");
        btn.html("Success!");
      }
    })
  },

  'click #pushoverTest' : function (event) {
    event.preventDefault();
    var btn = $(event.target);
    btn.html("Testing... <i class='fa fa-spin fa-refresh'></i>").removeClass().addClass("btn btn-info-outline");
    Meteor.call("testPushover", function (error, result) {
      if (error || !result) {
        btn.removeClass("btn-info-outline").addClass("btn-danger-outline");
        btn.html("Error!");
        Bert.alert(error.reason, "danger");
      } else if (result) {
        btn.removeClass("btn-info-outline").addClass("btn-success-outline");
        btn.html("Success!");
      }
    })
  },

  'click #slackTest' : function (event) {
    event.preventDefault();
    var btn = $(event.target);
    btn.html("Testing... <i class='fa fa-spin fa-refresh'></i>").removeClass().addClass("btn btn-info-outline");
    Meteor.call("testSlack", function (error, result) {
      if (error || !result) {
        btn.removeClass("btn-info-outline").addClass("btn-danger-outline");
        btn.html("Error!");
        Bert.alert(error.reason, "danger");
      } else if (result) {
        btn.removeClass("btn-info-outline").addClass("btn-success-outline");
        btn.html("Success!");
      }
    })
  },

  'click #plexsubmit' : function (event) {
    event.preventDefault();
    $('#plexsubmit').html("Getting Token... <i class='fa fa-spin fa-refresh'></i>");
    var username = $('#plexuser').val();
    var password = $('#plexpassword').val();
    Meteor.call("getPlexToken", username, password, function (error, result) {
      if (error) {
        $("#plexsubmit").html('Get token <i class="fa fa-key"></i>');
        Bert.alert(error.reason, "danger");
      } else if (result) {
        $("#plexsubmit").html('Get token <i class="fa fa-key"></i>');
        Bert.alert("Successfully got token!", "success");
      }
    });
    return false;
  },

  'click #getSonarrProfiles': function (event, template) {
    event.preventDefault();
    var btn = $(event.target);
    btn.html("Get Profiles <i class='fa fa-spin fa-refresh'></i>").removeClass().addClass("btn btn-info-outline");
    Meteor.call('SonarrProfiles', function (error, result) {
      if (result.length) {
        template.sonarrProfiles.set(result);
        Bert.alert('Retrieved Sonarr Profiles!', "success");
      } else {
        Bert.alert('Unable to retrieve Sonarr Profiles!', "danger");
      }
      btn.html("Get Profiles");
    });
  },

  'click #getRadarrProfiles': function (event, template) {
      event.preventDefault();
      var btn = $(event.target);
      btn.html("Get Profiles <i class='fa fa-spin fa-refresh'></i>").removeClass().addClass("btn btn-info-outline");
      Meteor.call("RadarrProfiles", function (error, result) {
          if (result.length) {
              template.radarrProfiles.set(result);
              Bert.alert('Retrieved Radarr Profiles!', "success");
          } else {
              Bert.alert('Unable to retrieve Radarr Profiles!', "danger");
          }
          btn.html("Get Profiles");
      });
  }
});
