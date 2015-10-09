Movies = new Mongo.Collection("movies");
TV = new Mongo.Collection("tv");

// DB Schemas

Movies.attachSchema(new SimpleSchema ({
	title: {
    type: String,
    label: "Movie title",
    max: 200
  },
  id: {
    type: Number,
    label: "TheMovieDB ID",
    unique: true
  },
  imdb: {
    type: Number,
    label: "IMDB ID",
    min: 0
  },
  released: {
    type: Date,
    label: "Release date"
  },
  user: {
    type: String,
    label: "Requesting user"
  },
  downloaded: {
  	type: Boolean,
  	label: "Status of downlaoded content"
  },
  createdAt: {
  	type: Date,
  	label: "Date of request"
  },
  approved: {
  	type: Boolean,
  	lable: "Approval status"
  }
}));

TV.attachSchema(new SimpleSchema ({
	title: {
    type: String,
    label: "TV Show title",
    max: 200
  },
  id: {
    type: Number,
    label: "TheMovieDB ID",
    unique: true
  },
  tvdb: {
    type: Number,
    label: "TVDB ID",
    min: 0
  },
  released: {
    type: Date,
    label: "Release date"
  },
  user: {
    type: String,
    label: "Requesting user"
  },
  downloaded: {
		type: Object,
  	label: "Status of downlaoded content"
  },
  createdAt: {
  	type: Date,
  	label: "Date of request"
  },
  approved: {
  	type: Boolean,
  	lable: "Approval status"
  }
}));