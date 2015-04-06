Template.home.helpers({
    movie: function () {
        var date = new Date(+new Date - 12096e5);
        return Movies.find({$or: [
            { $and : [ { downloaded : false } ] },
            { $and : [ { downloaded : true } , { createdAt: {"$gte": date} } ] }
        ]},
            {sort:{createdAt:-1}});
    },
    moviesearched: function () {
      return MovieSearch.find({});
    }
});
