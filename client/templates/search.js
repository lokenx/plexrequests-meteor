var timer = null;
Template.search.events({

/*
    'submit form': function (event) {
        $('#searchInfo').hide();
        $('#resultsList').hide();
        $('#addedSuccess').hide();
        $('#addedError').hide();
        $('#spinner').show();

        if (Session.get('searchType') === 'movie') {

            var url = "http://api.themoviedb.org/3/search/movie?api_key=95a281fbdbc2d2b7db59680dade828a6&query=" + document.getElementById("search").value;

            (function () {
                $.getJSON(url)
                    .done(function (data) {
                        MovieSearch._collection.remove({});
                        document.getElementById("search").blur();

                        if (data['total_results'] === 0) {
                            $('#spinner').hide();
                            $('#searchInfo').val('Hmm we got no results...search again?');
                            $('#searchInfo').show();
                            return;
                        } else {
                            for (i = 0; i < data['results'].length; i++) {
                                MovieSearch._collection.insert({
                                    title: data['results'][i]['title'],
                                    year: data['results'][i]['release_date'],
                                    id: data['results'][i]['id']
                                });
                            }
                            $('#spinner').hide();
                            $('#resultsList').show();
                        }
                    })
                    .fail(function () {
                        $('#spinner').hide();
                        $('#searchInfo').val('Hmm something went wrong with your search...search again?');
                        $('#searchInfo').show();
                    });
            }());
            return false;
        } else if (Session.get('searchType') === 'tv') {
            var url = "http://api.themoviedb.org/3/search/tv?api_key=95a281fbdbc2d2b7db59680dade828a6&query=" + document.getElementById("search").value;

            (function () {
                $.getJSON(url)
                    .done(function (data) {
                        TVSearch._collection.remove({});
                        document.getElementById("search").blur();

                        if (data['total_results'] === 0) {
                            $('#spinner').hide();
                            $('#searchInfo').val('Hmm we got no results...search again?');
                            $('#searchInfo').show();
                            return;
                        } else {
                            for (i = 0; i < data['results'].length; i++) {
                                if (data['results'][i]['first_air_date'] !== null) {
                                    year = data['results'][i]['first_air_date'];
                                } else {
                                    year = "unknown";
                                }
                                TVSearch._collection.insert({
                                    title: data['results'][i]['name'],
                                    year: year,
                                    id: data['results'][i]['id']
                                });
                            }
                            $('#spinner').hide();
                            $('#resultsList').show();
                        }
                    })
                    .fail(function () {
                        $('#spinner').hide();
                        $('#searchInfo').val('Hmm something went wrong with your search...search again?');
                        $('#searchInfo').show();
                    });
            }());

            return false;
        }
        return false;
    }
});
*/

    'keyup  #search': _.throttle(function (event) {
	    		$('#searchWorking').show();
	     		var searchterm = $(event.target).val().trim();
	     if ( searchterm.length >= 2 ){
		        var url = "http://www.omdbapi.com/?type=movie&s=" + searchterm +'*';
		        (function () {
		            $.getJSON(url)
		                .done(function (data) {
		                    MovieSearch._collection.remove({});
			                    clearTimeout(timer);
								timer = setTimeout(function(){
									$('#searchWorking').hide();
								}, 400);
		                    try {
		                        var len = data['Search'].length;
		                    } catch (err) {
		                        $('#searchError').html('Hmm we found no results...search again?').show();
		                        return;
		                    }

		                    for (i = 0; i < data['Search'].length; i++) {
			                    //Below is to check if movie is downloaded without needing to click any buttons
/*
						        var id = data['Search'][i]['imdbID'];

						        var statusText = Meteor.call('checkStatus', id, function (err, data) {
							        //console.dir(data);
						                if (err) {
						                    console.log(err)
						                } else {
						                    return data;
						                }
						        });
						        console.log(statusText);
*/
						        //End check status on results

		                        MovieSearch._collection.insert({
		                            title: data['Search'][i]['Title'],
		                            year: data['Search'][i]['Year'],
		                            imdb: data['Search'][i]['imdbID'],
		                            status: 'Add'
		                        });

		                    }
		                    $('#results').show();
		                    $('#searchError').hide();

		                })
		                .fail(function () {
		                    $('#searchError').html('Hmm something went wrong with your search...search again?').show();
		                });
		        }());
		        return false;
	    }else{
		   $('#searchError').hide();
		   MovieSearch._collection.remove({});
		   $('#results').hide();

	    }
    }, 400)
});
