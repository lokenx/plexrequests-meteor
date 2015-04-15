Template.results.helpers({
        contentSearched: function () {
            if (Session.get('searchType') === 'movie') {
                return MovieSearch.find({},{limit:10});
        } else if (Session.get('searchType') === 'tv') {
                return TVSearch.find({},{limit:10});
        }
    }
});