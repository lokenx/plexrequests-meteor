Template.headphonesStatus.onCreated(function(){
  this.subscribe('cpapi');

  // Attach vars to template to prevent polluting global

  // Enabled check
  Meteor.call('checkHeadphonesEnabled', function(error, result){
    if(!error && result){
      Session.set('headphonesEnabled', true);
    }
    else{
      Session.set('headphonesEnabled', false);
    }
  });

  // Connection check
  Meteor.call('checkHeadphones', function(error, result){
    if(!error && result){
      Session.set('headphonesStatus', true);
    }
    else{
      Session.set('headphonesStatus', false);
    }
  });
});

// Helpers
Template.headphonesStatus.helpers({
  enabled: function(){
    // Display string version of false because of blaze not rendering the boolean
    return Settings.findOne('headphonessetting', { fields: { enabled: 1 }}).enabled || 'false';
  },
  status: function(){
    // Display string version of false because of blaze not rendering the boolean
    return Session.get('headphonesStatus') || 'false';
  },
  enabledClass: function(elType){
    var enabled = Settings.findOne('headphonessetting', { fields: { enabled: 1 }}).enabled;
    if(elType === 'span'){
      return enabled ? 'enabledSuccess' : 'enabledError';
    }
    else if(elType === 'icon'){
      return enabled ? 'fa-check-circle' : 'fa-exclamation-circle';
    }
    else{
      console.error('This function is not intended for that');
    }
  },
  statusClass: function(elType){
    if(elType === 'span'){
      return Session.equals('headphonesStatus', true) ? 'cpSuccess' : 'cpError';
    }
    else if(elType === 'icon'){
      return Session.equals('headphonesStatus', true) ? 'fa-check-circle' : 'fa-exclamation-circle';
    }
    else{
      console.error('This function is not intended for that');
    }
  },
  headPhonesApi: function(){
    return Settings.findOne('headphonessetting').api;
  }
});


Template.headphonesIssues.helpers({
  headPhonesApi: function(){
    return Settings.findOne('headphonessetting', { fields: { api: 1 }}).api;
  }
});