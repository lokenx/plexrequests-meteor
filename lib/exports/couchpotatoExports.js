function Server() {
    this.url = "http://192.168.0.1";
    this.port = 5050;
    this.api = "abcdef012345";
    this.directory = "";
}

CouchPotato = new Server();

CouchPotato.appAvailable = function() {
    return Meteor.call("appAvailable", {});
};

CouchPotato.mediaGet = function(media) {
    return Meteor.call("mediaGet", media, {});
};

CouchPotato.movieAdd = function(media) {
    return Meteor.call("movieAdd", media, {});
};

CouchPotato.movieDelete = function(media) {
    return Meteor.call("movieDelete", media, {});
};
