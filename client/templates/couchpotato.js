Template.couchpotato.onCreated(function(){
  this.subscribe('cpapi');

  Session.set('isError', false);
  Session.set('isChecking', true);
  
  Meteor.call('checkCP', function(error, result) {
    if(error){
      console.error(error);
      Session.set('isError', true);
    }
    else{
        Session.set('cpConnection', result);
        if (!result) {
          Session.set('isError', true);
        }
    }
    Session.set('isChecking', false);
  });

  Meteor.call('checkCPEnabled', function(error, result) {
    if(error){
      console.error(error);
      Session.set('isError', true);
    }
    else{
      Session.set('cpEnabled', result);
      if (!result) {
          Session.set('isError', true);
      }
    }
  });
});

Template.couchpotato.helpers({
  cpClass: function(classFor, elementType){
    var className;

    /* Reactive */
    if(!Template.instance().subscriptionsReady()){ return; }

    var enabled = Settings.findOne('couchpotatosetting', { fields: { enabled: 1 } }).enabled;

    Session.set('cpEnabled', enabled);

    if(classFor === 'enabled' && elementType === 'span'){
      className = Session.equals('cpEnabled', true) ? 'enabledSuccess' : 'enabledError';
    }
    else if(classFor === 'enabled' && elementType === 'icon'){
      className = Session.equals('cpEnabled', true) ? 'fa-check-circle' : 'fa-exclamation-circle';
    }

    if(classFor === 'connection' && elementType === 'span'){
      className = Session.equals('cpConnection', true) ? 'cpSuccess' : 'cpError';
    }
    else if(classFor === 'connection' && elementType === 'icon'){
      className = Session.equals('cpConnection', true) ? 'fa-check-circle' : 'fa-exclamation-circle';
    }

    return className;
  },
  cpEnabled: function(){
    /* Return false as string as Blaze does not render out false */
    return Session.get('cpEnabled') || 'false';
  },
  cpConnection: function(){
    return Session.get('cpConnection') || 'error';
  },
  hasSlash: function(url){
    return /\/$/g.test(url);
  },
  cp: function () {
    if(!Template.instance().subscriptionsReady()){ return; }
    return Settings.findOne('couchpotatosetting').api;
  },
  isChecking: function(){
    return Session.get('isChecking');
  },
  isError: function(){
    return Session.get('isError');
  },
  url: function () {
    return Meteor.absoluteUrl();
  }
});

