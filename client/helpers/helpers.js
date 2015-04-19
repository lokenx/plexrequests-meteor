UI.registerHelper('plexauthuser',function(input){
    //Return whether they're authorized or not
    return Session.get("plexauthuser");
});

UI.registerHelper('searchType',function(input){
    return Session.get('searchType');
});

UI.registerHelper('searchIs',function(input){
    	if (Session.get('searchType') === 'movie') {
            return 'Movie';
        } else if (Session.get('searchType') === 'tv') {
            return 'TV Series';
        }else{
	        return '';
        }
});