Template.about.onCreated(function(){
    Session.set('commit','');
    Session.set('branch','');
    
    Meteor.call('getCommit', function(error, result) {
        if (error) {
            console.log(error);
        } else {
            Session.set('commit',result);
        }
    });
    
    Meteor.call('getBranch', function(error, result) {
        if (error) {
            console.log(error);
        } else {
            Session.set('branch',result);
        }
    });
    
    Meteor.call('getCurrentCommit', function(error, result) {
        if (error) {
            console.log(error);
            Session.set('error', true);
        } else {
            Session.set('upToDate', result);
        }
    });
});

Template.about.helpers({
    commit: function(){
        return Session.get('commit');
    },
    branch: function(){
        return Session.get('branch');
    },
    update: function(){
        return Session.get('upToDate');
    },
    error: function(){
        return Session.get('error');
    },
     url: function () {
         return Meteor.absoluteUrl();
     }
});
