Template.requests.helpers({
    content: function () {
        if (Session.get('searchType') === 'movie') {
            var date = new Date(+new Date - 12096e5);
            return Movies.find({$or: [
                { downloaded : false },
                { downloaded : true , createdAt: {"$gte": date} }
            ]},
                {sort:{createdAt:-1}});
        } else if (Session.get('searchType') === 'tv') {
            var date = new Date(+new Date - 12096e5);
            return TV.find({$or: [
                { downloaded : false },
                { downloaded : true , createdAt: {"$gte": date} }
            ]},
                {sort:{createdAt:-1}});
        }
    }
});