Template.search.events({
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
