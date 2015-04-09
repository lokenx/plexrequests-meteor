Router.configure({
  loadingTemplate: 'loading'
});

Router.configure({
  notFoundTemplate: "NotFound"
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/couchpotato', function () {
  this.render('couchpotato');
});

MovieResults = new Mongo.Collection("movieresults");
TVResults = new Mongo.Collection("tvresults");
Meteor.subscribe('movies');
Meteor.subscribe('settings');

Session.set('mresultsloaded', false);
Session.set('tresultsloaded', false);
Session.set('searchingresults', false);
Session.set('noresults', false);
Session.set('searcherror', false);
Session.set('mrequests', false);
Session.set('trequests', false);
Session.set('movieadded', false);
Session.set('movieexists', false);
Session.set('moviedownloaded', false);
Session.set('movie', false);
Session.set('tvsearch', false);