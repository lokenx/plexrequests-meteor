Meteor.methods({
  addShow: function(tvdbid, episodes){
    try {
      check(SickRage.url, String);
      check(SickRage.port, Number);
      check(SickRage.api, String);
      check(SickRage.directory, String);
      check(tvdbid, Number);
      check(episodes, Number);
    } catch (e) {
      console.log(e.message);
      return false;
    }

    var episodeStatus = (episodes === 1) ? "&status=wanted" : "";

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      var response = HTTP.call("GET",
        SickRage.url + ":" + SickRage.port + SickRage.directory + "/api/" + SickRage.api + "?cmd=show.addnew&tvdbid=" + tvdbid + episodeStatus,
        {timeout: 2000} );
    } catch (e) {
      console.log(e.message);
      return false;
    }

    var status;

    if (response.data) {
      status = (response.data.result == "success");
    } else {
      status = false;
    }

    return status;
  },

  available: function(){
    try {
      check(SickRage.url, String);
      check(SickRage.port, Number);
      check(SickRage.api, String);
    } catch (e) {
      console.log(e.message);
      return false;
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      var response = HTTP.call("GET", SickRage.url + ":" + SickRage.port + SickRage.directory + "/api/" + SickRage.api + "/?cmd=sb.ping", {timeout: 2000} );
    } catch (e) {
      console.log(e.message);
      return false;
    }

    return (response.data)
  },

  checkShow: function(tvdbid){
    try {
      check(SickRage.url, String);
      check(SickRage.port, Number);
      check(SickRage.api, String);
      check(tvdbid, Number);
    } catch (e) {
      console.log(e.message);
      return false;
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      var response = HTTP.call("GET", SickRage.url + ":" + SickRage.port + SickRage.directory + "/api/" + SickRage.api + "?cmd=show&tvdbid=" + tvdbid, {timeout: 2000} );
    } catch (e) {
      console.log(e.message);
      return false;
    }

    var status;

    if (response.data) {
      status = (response.data.result == "success");
    } else {
      status = false;
    }

    return status;
  },

  deleteShow: function(tvdbid){
    try {
      check(SickRage.url, String);
      check(SickRage.port, Number);
      check(SickRage.api, String);
      check(tvdbid, Number);
    } catch (e) {
      console.log(e.message);
      return false;
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      var response = HTTP.call("GET", SickRage.url + ":" + SickRage.port + SickRage.directory + "/api/" + SickRage.api + "?cmd=show.delete&tvdbid=" + tvdbid, {timeout: 2000} );
    } catch (e) {
      console.log(e.message);
      return false;
    }

    var status;

    if (response.data) {
      status = (response.data.result == "success");
    } else {
      status = false;
    }

    return status;
  },

  statsShow: function(tvdbid){
    try {
      check(SickRage.url, String);
      check(SickRage.port, Number);
      check(SickRage.api, String);
      check(tvdbid, Number);
    } catch (e) {
      console.log(e.message);
      return false;
    }

    //Workaround to allow self-signed SSL certs, however can be dangerous and should not be used in production, looking into better way
    //But it's possible there's nothing much I can do
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      var response = HTTP.call("GET", SickRage.url + ":" + SickRage.port + SickRage.directory + "/api/" + SickRage.api + "?cmd=show.stats&tvdbid=" + tvdbid, {timeout: 2000} );
    } catch (e) {
      console.log(e.message);
      return false;
    }

    var status;

    if (response.data.data.total) {
      var total = response.data.data.total - response.data.data.unaired;
      var downloaded = response.data.data.downloaded.total;
      status = {"downloaded" : downloaded, "total" : total}
    } else {
      status = {"downloaded" : 0, "total" : 0}
    }

    return status;
  }
});
