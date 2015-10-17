Template.requests.helpers({
	'poster_path' : function () {
		var poster = (this.poster_path !== "/") ? "http://image.tmdb.org/t/p/w154" + this.poster_path : "poster-placeholder.png";
    return poster;
  },
  'release_date' : function () {
  	return moment(this.released).format('MMMM Do, YYYY');
  },
  'approval_status' : function () {
  	var approval = (this.approved) ? '<i class="fa fa-check success-icon"></i>': '<i class="fa fa-times error-icon"></i>';
  	return approval;
  },
  'download_status' : function () {
  	//Movie true/false
  	if (this.imdb) {
  		var approval = (this.downloaded) ? '<i class="fa fa-check success-icon"></i>': '<i class="fa fa-times error-icon"></i>';  		
  	} else {
  		//TV dowloaded:total
  	}
  	return approval;
  },
  'requesting_user' : function () {
  	if (Meteor.user()) {
  		return "<li>User: " + this.user + "</li>";
  	}
  }
})