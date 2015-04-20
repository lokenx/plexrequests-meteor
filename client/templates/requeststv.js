TVFilter = new Meteor.FilterCollections(TV, {
	  	template: 'requeststv',
	  	name: 'filter-tv',
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
	/* //Can not seme ti get the filter click to only show none downloaded movies
		filters: {
		     "downloaded": {
			      title: 'Not Downloaded',
			      value: true,
			      condition: '$and',
			      searchable: 'optional'
			    }
	    }
	*/

});