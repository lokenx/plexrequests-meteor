MovieSearch = new Mongo.Collection("moviesearch");
Session.set('resultsloaded', false);
Session.set('searchingresults', false);
Session.set('noresults', false);
Session.set('searcherror', false);
Session.set('requests', false);
Session.set('movieadded', false);
Session.set('movieexists', false);
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

Router.map(function(){
    this.route('home', {path: '/'} );
});