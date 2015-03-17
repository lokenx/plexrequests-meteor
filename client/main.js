MovieSearch = new Mongo.Collection("moviesearch");
Session.set('resultsloaded', false);
Session.set('searchingresults', false);
Meteor.Spinner.options = {color: "#DD6928"};

$("#showmodal").on("click", function() {
    $('#myModal').modal('show');
    return false;
});