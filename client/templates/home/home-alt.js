Template.homealt.onRendered(function () {
  var instance = this;

  instance.redirect = Meteor.setTimeout(function() {
    Router.go('search.page')
  }, 3100);

  Meteor.setInterval(function(){
    var countdown = instance.countdown.get();
    instance.countdown.set(countdown -1);
  }, 1000);
});

Template.homealt.onCreated(function () {
  this.countdown = new ReactiveVar(3);
});

Template.homealt.helpers({
  countdown: function () {
    return Template.instance().countdown.get();
  }
});

Template.homealt.onDestroyed(function () {
  // Required so that if you hit back button numerous times
  // you don't view the page while the timeout is still active
  var instance = this;
  Meteor.clearTimeout(instance.redirect);
});
