Template.item.helpers({
  'first': function () {
    return this.index == 0;
  },
  'posterExists' : function () {
    return this.poster_path != "";
  },
  'isTV' : function () {
  	return this.media_type === "tv";
  },
  'isRequested' : function () {
  	if (this.media_type === "tv") {
  		if (TV.findOne({id: this.id})) {
  			return true;
  		} else {
  			return false;
  		}
  	}
 		else if (this.media_type === "movie") {
  		if (Movies.findOne({id: this.id})) {
  			return true;
  		} else {
  			return false;
  		}
  	}
  }
})
