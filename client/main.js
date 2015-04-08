MovieSearch = new Mongo.Collection("moviesearch");
Session.set('resultsloaded', false);
Session.set('searchingresults', false);
Session.set('noresults', false);
Session.set('searcherror', false);
Session.set('requests', false);
Session.set('movieadded', false);
Session.set('movieexists', false);
Session.set('moviedownloaded', false);
//Session.set('plexauthuser', false);
Meteor.Spinner.options = {color: "#DD6928"};

$("#showmodal").on("click", function() {
    $('#myModal').modal('show');
    return false;
});


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

Router.route('/plex', function () {
  this.render('plex');
});

Meteor.subscribe('movies');
Meteor.subscribe('settings');
Meteor.subscribe('plex');