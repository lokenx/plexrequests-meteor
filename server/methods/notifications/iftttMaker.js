Meteor.methods({
	'sendIFTTT': function(settings, request) {

//////// Function Constants

	var access_token = settings.iftttMAKERAPI;
	var channel_tag = settings.iftttMAKERCHANNEL;
    var values = Meteor.call('setIFTTTVARS', settings, request);
    var ifttt_url = 'https://maker.ifttt.com/trigger/' + channel_tag + '/with/key/' + access_token;
    
	console.log(ifttt_url);

	console.log(values);
    var data = { 
        data: {
            'value1': values.value1,
            'value2': values.value2,
            'value3': values.value3 
        }
    };
//////// Create JSON object of http.post Parameters
	if(typeof channel_tag === 'undefined' ) {
	    return false
    }
////// Attempt to send notification with HTTP.post()

	try {
		HTTP.post(ifttt_url, data);
		return true;
	}
	
	catch (error) {
		var err = error.response.data.error.message;
		logger.error('IFTTT Maker error: ' + err);
		throw err;
	}
  }
});
