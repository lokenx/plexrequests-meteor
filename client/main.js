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

MovieSearch = new Mongo.Collection("moviesearch");
Meteor.subscribe('movies');
Meteor.subscribe('settings');

Session.set('resultsloaded', false);
Session.set('searchingresults', false);
Session.set('noresults', false);
Session.set('searcherror', false);
Session.set('requests', false);
Session.set('movieadded', false);
Session.set('movieexists', false);
Session.set('moviedownloaded', false);