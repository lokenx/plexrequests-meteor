Movies = new Mongo.Collection("movies");
TV = new Mongo.Collection("tv");
Settings = new Mongo.Collection("settings");

TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Movies = new Tabular.Table({
  name: "MovieList",
  collection: Movies,
  columns: [
      {data: "title", title: "Title"},
      {data: "released", title: "Released"},
      {data: "downloaded", title: "Done",
            render: function (data) {
                if (data === true) {
                  return '<i class="fa fa-check-circle enabledSuccess"></i>';
                } else {
                  return '<i class="fa fa-cloud-download"></i>';
                }
          }
      },
      {data: "id", title: "Info",
         tmpl: Meteor.isClient && Template.movielink
      },
      {data: "user", title: "User",
            render: function (data) {
                if (Meteor.userId()) {
                    return data;
                } else {
                    return '';
                }
            }
      }
  ]
});

TabularTables.TV = new Tabular.Table({
  name: "TVList",
  collection: TV,
  columns: [
      {data: "title", title: "Title"},
      {data: "released", title: "Released"},
      {data: "user", title: "User",
            render: function (data) {
                if (Meteor.userId()) {
                    return data;
                } else {
                    return '';
                }
            }
      },
      {data: "id", title: "Info",
         tmpl: Meteor.isClient && Template.tvlink
      },
      {data: "user", title: "User",
            render: function (data) {
                if (Meteor.userId()) {
                    return data;
                } else {
                    return '';
                }
            }
      }
  ]
});