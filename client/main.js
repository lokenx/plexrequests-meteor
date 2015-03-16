MovieSearch = new Mongo.Collection("moviesearch");

$("#showmodal").on("click", function() {
    $('#myModal').modal('show');
    return false;
});