Template.search.events({
    'submit form': function (event) {
        $('#searchInfo').hide();
        $('#resultsList').hide();
        $('#addedSuccess').hide();
        $('#addedError').hide();
        $('#spinner').show();
        
        if (Session.get('searchType') === 'movie') {
            var url = "http://www.omdbapi.com/?type=movie&s=" + document.getElementById("search").value;

            (function () {
                $.getJSON(url)
                    .done(function (data) {
                        MovieSearch._collection.remove({});
                        document.getElementById("search").blur();

                        try {
                            var len = data['Search'].length;
                        } catch (err) {
                            $('#spinner').hide();
                            $('#searchInfo').val('Hmm we got no results...search again?');
                            $('#searchInfo').show();
                            return;
                        }

                        for (i = 0; i < data['Search'].length; i++) {
                            MovieSearch._collection.insert({
                                title: data['Search'][i]['Title'],
                                year: data['Search'][i]['Year'],
                                imdb: data['Search'][i]['imdbID']
                            });
                        }
                        $('#spinner').hide();
                        $('#resultsList').show();
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
