Template.sickrage.onCreated(function(){
  this.subscribe('cpapi');
  Session.set('isError', false);
  Session.set('isChecking', true);

  Meteor.call('checkSR', function(error, result) {
    if(error){
      console.error(error);
      Session.set('isError', true);
    }
    else{
        Session.set('srConnection', result);
        if (!result) {
          Session.set('isError', true);
        }
    }
    Session.set('isChecking', false);
  });

  Meteor.call('checkSREnabled', function(error, result) {
    if(error){
      console.error(error);
      Session.set('isError', true);
    }
    else{
      Session.set('srEnabled', result);
      if (!result) {
          Session.set('isError', true);
      }
    }
  });
});


Template.sickrage.helpers({
    srClass: function(classFor, elementType){
      var className;

      /* Reactive */
      if(!Template.instance().subscriptionsReady()){ return; }

      var enabled = Settings.findOne('sickragesetting', { fields: { enabled: 1 } }).enabled;

      Session.set('srEnabled', enabled);

      if(classFor === 'enabled' && elementType === 'span'){
        className = Session.equals('srEnabled', true) ? 'enabledSuccess' : 'enabledError';
      }
      else if(classFor === 'enabled' && elementType === 'icon'){
        className = Session.equals('srEnabled', true) ? 'fa-check-circle' : 'fa-exclamation-circle';
      }

      if(classFor === 'connection' && elementType === 'span'){
        className = Session.equals('srConnection', 'success') ? 'cpSuccess' : 'cpError';
      }
      else if(classFor === 'connection' && elementType === 'icon'){
        className = Session.equals('srConnection', 'success') ? 'fa-check-circle' : 'fa-exclamation-circle';
      }

      return className;
    },
    srEnabled: function(){
      /* Return false as string as Blaze does not render out false */
      return Session.get('srEnabled') || 'false';
    },
    srConnection: function(){
      return Session.get('srConnection') || 'error';
    },
    sr: function () {
      if(!Template.instance().subscriptionsReady()){ return; }
      return Settings.findOne({_id: "sickragesetting"}).api;
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