Template.requestsmovie.helpers({
    Movies: function () {
        return Movies;
    }
});

//https://github.com/aslagle/reactive-table

Template.requestsmovie.helpers({
    moviesettings: function () {
        return {
            collection: Movies,
            rowsPerPage: 10,
            class: 'table table-bordered table-striped',
            showFilter: true,
            responsive: true,
            fields: [
	            { key: 'createdAt', label: 'Created', sort: 'descending', hidden: true },
			    { key: 'title',  label: 'Title' },
			    { key: 'released',  label: 'Released' },
			    { key: 'downloaded', label:'Done',
				    fn: function (value) {
					    if(value===true){
						    return new Spacebars.SafeString('<i class="fa fa-check-circle enabledSuccess"></i>');
						}else{
							return new Spacebars.SafeString('<i class="fa fa-cloud-download"></i>');
						};
					}
				},
				{key: "id", label: "Info",
		            tmpl: Meteor.isClient && Template.movielink
		        },
			    { key: 'user',  label: 'User',
				    fn: function (value) {
					    if (Meteor.userId()) {
		                    return value;
		                } else {
		                    return '';
		                }
					}
				}

			]
        };
    }
});