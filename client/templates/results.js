Template.results.helpers({
    contentSearched: function () {
        return currentSearch.find({},{limit:10});
    }
});