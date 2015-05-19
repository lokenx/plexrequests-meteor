Template.sonarr.onCreated(function(){
    this.subscribe('cpapi');
    Session.set('isChecking', true);
    Session.set('isError', false);

  /* Initial Checks */
  Meteor.call('checkSOEnabled', function(error, result){
    if(error){
        console.error(error);
        Session.set('isError', true);
    }
    else{
        Session.set('sonarrEnabled', result);
        if (!result) {
            Session.set('isError', true);
        }

    }
  });

  Meteor.call('checkSO', function(error, result){
    if(error){
        console.error(error);
        Session.set('isError', true);
    }
    else{
        Session.set('sonarrConnection', result);
        Session.set('isChecking', false);
        if (!result) {
            Session.set('isError', true);
        }
    }
  });
});

Template.sonarr.helpers({
  sonarrClass: function(classFor, elementType){
    var className;

    /* Reactive */
    if(!Template.instance().subscriptionsReady()){ return; }

    var enabled = Settings.findOne('sonarrsetting', { fields: { enabled: 1 } }).enabled;

    Session.set('sonarrEnabled', enabled);

    if(classFor === 'enabled' && elementType === 'span'){
      className = Session.equals('sonarrEnabled', true) ? 'enabledSuccess' : 'enabledError';
    }
    else if(classFor === 'enabled' && elementType === 'icon'){
      className = Session.equals('sonarrEnabled', true) ? 'fa-check-circle' : 'fa-exclamation-circle';
    }

    if(classFor === 'connection' && elementType === 'span'){
      className = Session.equals('sonarrConnection', true) ? 'cpSuccess' : 'cpError';
    }
    else if(classFor === 'connection' && elementType === 'icon'){
      className = Session.equals('sonarrConnection', true) ? 'fa-check-circle' : 'fa-exclamation-circle';
    }

    return className;
  },
  sonarrEnabled: function(){
    /* Return false as string as Blaze does not render out false */
    return Session.get('sonarrEnabled') || 'false';
  },
  sonarrConnection: function(){
    return Session.get('sonarrConnection') || 'error';
  },
  sonarrApi: function(){
    if(!Template.instance().subscriptionsReady()){ return; }

    return Settings.findOne('sonarrsetting', { fields: { api: 1 } }).api;
  },
    sonarrApiKey : function () {
        if(!Template.instance().subscriptionsReady()){ return; }
    return Settings.findOne('sonarrsetting').api_key;
  },  
    sonarrqPID : function () {
        if(!Template.instance().subscriptionsReady()){ return; }
    return Settings.findOne('sonarrsetting').qualityProfileId;
  },
    sonarrrFP : function () {
        if(!Template.instance().subscriptionsReady()){ return; }
    return Settings.findOne('sonarrsetting').rootFolderPath;
  },
  baseUrl: function(){
    return Meteor.absoluteUrl();
  },
  isChecking: function(){
    return Session.get('isChecking');
  },
    isError: function(){
    return Session.get('isError');
  }
});