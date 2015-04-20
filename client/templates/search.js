var timer = null; //timer varible is to turn off search spiner after typing has stopped
var status;
Template.search.events({
	'submit #searchForm': function () {
			    //event.preventDefault();
			    return false;
	},
	'focus #search': function () {
			    $('#search').select().mouseup(function (e) {
			        e.preventDefault();
			        $(this).unbind("mouseup");
			    });
	},
	'keyup  #search': _.throttle(function (event) {
			$('#searchWorking').show();
		    var searchterm = $(event.target).val().trim();
		    var url = "http://api.themoviedb.org/3/search/"+Session.get('searchType')+"?api_key=95a281fbdbc2d2b7db59680dade828a6&query=" + searchterm;
		    if ( searchterm.length >= 2 ){
				     	(function () {
			                $.getJSON(url)
			                    .done(function (data) {
			                        currentSearch._collection.remove({});
			                        clearTimeout(timer);
										timer = setTimeout(function(){
											$('#searchWorking').hide();
										}, 400);

			                        if (data['total_results'] === 0) {
			                            $('#searchError').html('Hmm something went wrong with your search...search again?').show();
			                            return;
			                        } else {
			                            for (i = 0; i < data['results'].length; i++) {
				                            status = 'Add';
				                            id = data['results'][i]['id'];
				                            if(Session.get('searchType') === 'movie'){
					                            title = data['results'][i]['title'];
					                            year = data['results'][i]['release_date'];
					                            if (!(Movies.findOne({imdb: id}) === undefined )) {
						                            if (Movies.findOne({imdb: id}).downloaded === true) {
										                status = 'Already in Library';
										            } else {
										                status = 'Already Requested';
										            }
						                        }

					                        } else if(Session.get('searchType') === 'tv'){
					                            title = data['results'][i]['name'];
					                            if (data['results'][i]['first_air_date'] !== null) {
				                                    year = data['results'][i]['first_air_date'];
				                                } else {
				                                    year = "unknown";
				                                }
					                            if (!(TV.findOne({tvdb: id}) === undefined )) {
						                            if (TV.findOne({tvdb: id}).downloaded === true) {
										                status = 'Already in Library';
										            } else {
										                status = 'Already Requested';
										            }
						                        }
				                            }

			                                currentSearch._collection.insert({
			                                    id: id,
			                                    title: title,
			                                    year: year,
												status: status
			                                });
			                            }
			                             $('#resultsList').show();
										 $('#searchError').hide();
			                        }
			                    })
			                    .fail(function () {
			                        $('#searchError').html('Hmm something went wrong with your search...search again?').show();
			                    });
			            }());
					return false;
			}else{ //End if less than two charectors in search
				$('#searchWorking').show();
				$('#searchError').hide();
				currentSearch._collection.remove({});
				$('#resultsList').hide();

			}
		    return false;

    }, 400)//end keyup throttle

});