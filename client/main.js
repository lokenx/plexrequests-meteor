MovieSearch = new Mongo.Collection("moviesearch");
Session.set('resultsloaded', false);
Session.set('searchingresults', false);
Session.set('noresults', false);
Session.set('searcherror', false);
Session.set('requests', false);
Session.set('movieadded', false);
Session.set('movieexists', false);
Session.set('moviedownloaded', false);

/*Below is commented out as it was overwriting the persistent session*/
//Session.set('plexauthuser', false);

$("#showmodal").on("click", function() {
    $('#myModal').modal('show');
    return false;
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
Meteor.subscribe('cpapi');

Template.body.helpers({
    url: function () {
    return Meteor.absoluteUrl();
    }
});

Houston.menu({
  'type': 'link',
  'use': Meteor.absoluteUrl() + 'plex',
  'title': 'Plex Auth Setup',
  'target': '_blank'
});

Houston.menu({
  'type': 'link',
  'use': Meteor.absoluteUrl() + 'couchpotato',
  'title': 'CouchPotato Status',
  'target': '_blank'
});

Houston.menu({
  'type': 'link',
  'use': 'http://plexrequests.8bits.ca',
  'title': 'Plex Requests Info',
  'target': '_blank'
});