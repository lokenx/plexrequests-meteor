UI.registerHelper('plexauthuser',function(input){
    //Return whether they're authorized or not
    return Session.get("plexauthuser");
});

UI.registerHelper('searchType',function(input){
    return Session.get('searchType');
});

UI.registerHelper('isMovie',function(input){
    if (Session.get('searchType') === 'movie') {
        return true;
    } else {
        return false;
    }
});

UI.registerHelper('baseUrl',function(){
  return Meteor.absoluteUrl();
});