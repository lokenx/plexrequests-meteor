UI.registerHelper('plexauthuser',function(input){
    //Return whether they're authorized or not
    return Session.get("plexauthuser");
});

UI.registerHelper('searchType',function(input){
    return Session.get('searchType');
});