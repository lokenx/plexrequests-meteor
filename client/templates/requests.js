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
            fields: [
			    { key: 'title',  label: 'Title' },
			    { key: 'released',  label: 'Released' },
			    { key: 'downloaded', label:'Done',
				    fn: function (value) {
					    if(value===true){
						    return '<i class="fa fa-check-circle enabledSuccess"></i>';
						}else{
							return '<i class="fa fa-cloud-download"></i>';
						};
					}
				},
				{key: "id", title: "Info",
		            tmpl: Meteor.isClient && Template.movielink
		        },
			    { key: 'user',  label: 'User',
				    fn: function (value) {
					    if (Meteor.userId()) {
		                    return data;
		                } else {
		                    return '';
		                }
					}
				}

			]
        };
    }
});