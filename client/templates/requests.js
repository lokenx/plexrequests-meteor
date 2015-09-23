Template.requests.helpers({
    Movies: function () {
		var date = new Date(+new Date - 12096e5);
		return Movies.find({$or: [
			{ downloaded : false },
			{ downloaded : true , createdAt: {"$gte": date} }
			]});
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
				    { key: 'downloaded', label:function() {return new Spacebars.SafeString("<span title='Green check mark means Movie is available'>Status</span>")}, cellClass: 'Status',
					    hidden: function () { if (Session.get('searchType') === 'movie'){ return false; }else{ return true; } },
					    fn: function (value) {
						    if(value===true){
							    return new Spacebars.SafeString('<i class="fa fa-check-circle enabledSuccess"></i>');
							}else{
								return new Spacebars.SafeString('<i class="fa fa-cloud-download"></i>');
							};
						}
					},
					{ key: "imdb", label: "Info", cellClass: 'Info', sortable: false,
                hidden: function () {if (Session.get('searchType') === 'movie') { return false; } else { return true; }
                },
                fn: function (value) {
					            return new Spacebars.SafeString('<a href="http://www.dereferer.org/?http://www.imdb.com/title/'+value+'" target="_blank" style="text-align:center;"><i class="fa fa-external-link-square"></i></a>');
						  }
          },
          { key: "tvdb", label: "Info", cellClass: 'Info', sortable: false,
                hidden: function () {if (Session.get('searchType') === 'tv') { return false; } else { return true; }
                },
                fn: function (value) {
					            return new Spacebars.SafeString('<a href="http://www.dereferer.org/?http://thetvdb.com/?tab=series&id='+value+'" target="_blank" style="text-align:center;"><i class="fa fa-external-link-square"></i></a>');
						  }
          },
            { key: 'user',  label: 'User', cellClass: 'User',
              hidden: function () { if (Meteor.userId()){ return false; }else{ return true; } },
          }

				]
	        };
	}
});

Template.requests.onCreated(function(){
    $('th.downloaded').hide();
});
