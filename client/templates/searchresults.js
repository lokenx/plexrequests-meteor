Template.results.helpers({
        contentSearched: function () {
            if (Session.get('searchType') === 'movie') {
                return MovieSearch.find({});
        }
    }
});