Template.home.helpers({
    movie: function () {
        var date = new Date(+new Date - 12096e5);
        return Movies.find({$or: [
            { downloaded : false },
            { downloaded : true , createdAt: {"$gte": date} }
        ]},
            {sort:{createdAt:-1}});
    },
    moviesearched: function () {
      return MovieResults.find({});
    }
});
