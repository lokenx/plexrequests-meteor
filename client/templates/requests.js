MovieFilter = new Meteor.FilterCollections(Movies, {
  	template: 'requests',
  	name: 'filter-movies',
  	sort:{
	    order: ['desc', 'asc'],
/*
	    defaults: [
	      ['released', 'desc'],
	      ['title', 'asc']
	    ]
*/
	  },
	pager: {
	   //options: [20, 10, 15, 25, 50],
	   itemsPerPage: 10,
	   //currentPage: 1,
	   //showPages: 5,
	},
	filters: {
	     "downloaded": {
		      title: 'Not Downloaded',
		     // value: true,
		      //condition: '$and',
		      //searchable: 'optional'
		    }
    }

});
/*
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
*/