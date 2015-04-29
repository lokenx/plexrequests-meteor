Template.requests.helpers({
    Movies: function () {
        return Movies;
    }
});
Template.requests.helpers({
    TV: function () {
        return TV;
    }
});

//https://github.com/aslagle/reactive-table
Template.requests.helpers({
	settings: function () {
	        return {
	            rowsPerPage: 10,
	            class: 'table',
	            showFilter: true,
	            fields: [
		            { key: 'createdAt', label: 'Created', sort: 'descending', hidden: true },
				    { key: 'title',  label: 'Title', cellClass: 'Title'},
				    { key: 'released',  label: 'Released', cellClass: 'Released' },
				    { key: 'downloaded', label:'Done', cellClass: 'Done',
					    hidden: function () { if (Session.get('searchType') === 'movie'){ return false; }else{ return true; } },
					    fn: function (value) {
						    if(value===true){
							    return new Spacebars.SafeString('<i class="fa fa-check-circle enabledSuccess"></i>');
							}else{
								return new Spacebars.SafeString('<i class="fa fa-cloud-download"></i>');
							};
						}
					},
					{ key: "id", label: "Info", cellClass: 'Info', sortable: false,
			            fn: function (value) {
							    return new Spacebars.SafeString('<a href="http://www.dereferer.org/?https://www.themoviedb.org/movie/'+value+'" target="_blank" style="text-align:center;"><i class="fa fa-external-link-square"></i></a>');
						}
			        },
				    { key: 'user',  label: 'User', cellClass: 'User',
					    hidden: function () { if (Meteor.userId()){ return false; }else{ return true; } },
					}

				]
	        };
	}
});