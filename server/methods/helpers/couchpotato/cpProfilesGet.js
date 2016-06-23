Meteor.methods({
  cpProfilesGet: function(){
    try {
      check(CouchPotato.url, String);
      check(CouchPotato.port, Number);
      check(CouchPotato.api, String);
    } catch (e) {
      console.log(e.message);
      return false;
    }
    // Function to check if profile label contains a number or hyphen
    // This is necessary due to not being able to access JSON objects by name
    // if stored with an invalid character in the key name
    function hasNum(label){
      if(/\d/.test(label))
        {       
          
          return false;

        }
        if(label.indexOf('-')!== -1){
        return false;
        }
        return true;
    };   


    var results = {};
    results.profiles={};
    
    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    
    try {
      var response = HTTP.call("GET", CouchPotato.url + ":" + CouchPotato.port + CouchPotato.directory + "/api/" + CouchPotato.api + "/profile.list", {timeout: 2000} );
    } catch (e) {
      console.log(e);
      return false;
    }
    
    if (response.data.success) {
      if (response.data.list.length > 0) {
        for (var i = 0; i <= response.data.list.length-1; i++) {
          // Check if label has a no no character, only use those that dont
          if (!response.data.list[i].hide && hasNum(response.data.list[i].label)) {        
            results.profiles[response.data.list[i].label]=response.data.list[i]._id;
          }    
        }
      } 
    } 
    
    else {
      return "false"
    }

    return results;
  }
});
