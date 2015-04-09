Template.tvsearch.events({
    'submit form': function (event) {
        Session.set('searchingresults', true);
        Session.set('tresultsloaded', false);
        Session.set('noresults', false);
        Session.set('searcherror', false);
        Session.set('trequests', false);
        Session.set('movieadded', false);
        Session.set('movieexists', false);
        Session.set('moviedownloaded', false);
        var url = "http://www.omdbapi.com/?type=series&s=" + document.getElementById("search").value;

        (function () {
            $.getJSON(url)
                .done(function (data) {
                    TVResults._collection.remove({});
                    document.getElementById("search").blur();

                    try {
                        var len = data['Search'].length;
                    } catch (err) {
                        Session.set('searchingresults', false);
                        Session.set('noresults', true);
                        return;
                    }

                    for (i = 0; i < data['Search'].length; i++) {
                        TVResults._collection.insert({
                            title: data['Search'][i]['Title'],
                            year: data['Search'][i]['Year'],
                            imdb: data['Search'][i]['imdbID']
                        });
                    }
                    Session.set('searchingresults', false);
                    Session.set('tresultsloaded', true);
                    Session.set('noresults', false);
                })
                .fail(function () {
                    Session.set('searchingresults', false);
                    Session.set('noresults', false);
                    Session.set('searcherror', true);
                });
        }());
        return false;
    }
});
