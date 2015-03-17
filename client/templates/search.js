Template.search.events({
    'submit form': function (event) {
        Session.set('searchingresults', true);
        Session.set('resultsloaded', false);
        document.getElementById("info").innerHTML = "";
        document.getElementById("info").setAttribute("class", "");
 
        var url = "http://www.omdbapi.com/?type=movie&s=" + document.getElementById("search").value;
        
        (function () {
            $.getJSON(url)
                .done(function (data) {
                    MovieSearch._collection.remove({});
                    document.getElementById("search").blur();
                
                    try {
                        var len = data['Search'].length;
                    } catch (err) {
                        Session.set('searchingresults', false);
                        document.getElementById("info").setAttribute("class", "alert alert-warning");
                        document.getElementById("info").innerHTML = '<p>Hmm we got no results...<a href="javascript:document.getElementById(\'search\').focus()" class="alert-link">try again!</a></p>';
                        document.getElementById("overview").innerHTML = "";
                        return;
                    }
                
                    for (i = 0; i < data['Search'].length; i++) {
                        MovieSearch._collection.insert({
                            title: data['Search'][i]['Title'],
                            year: data['Search'][i]['Year'],
                            imdb: data['Search'][i]['imdbID']
                        });
                    }
                    Session.set('searchingresults', false);
                    Session.set('resultsloaded', true);
                })
                .fail(function () {
                    Session.set('searchingresults', false);
                    var msg = '<p>Hmmm something went wrong with your search...<a href="javascript:document.getElementById(\'search\').focus()" class="alert-link">try again in a few moments!</a></p>';
                    document.getElementById("info").setAttribute("class", "alert alert-danger");
                    document.getElementById("info").innerHTML = msg;
                });
        }());
        return false;
    }
});