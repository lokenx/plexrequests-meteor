Template.logs.helpers({
  logs: function () {
    return Template.instance().logs.get();
  },
  settings: function () {
    return {
      collection: Template.instance().logs.get().file,
      rowsPerPage: 10,
      showFilter: true,
      class: "table col-sm-12",
      fields: [
        { key: 'level', label: 'Level' },
        { key: 'message', label: 'Message' },
        { key: 'timestamp', label: 'Time', sortDirection: 'descending', sortOrder: 0, fn: function (value) {
          return new Spacebars.SafeString(moment(value).format("YYYY/MM/D HH:mm:ss"))
        }}
      ]
    };
  }
});

Template.logs.onCreated(function () {
  var instance = this;
  instance.logs = new ReactiveVar();

  Meteor.call("getLogs", 0, 100, function (error, data) {
    if (error) {
      console.error(error)
    }

    instance.logs.set(data);

  })
});
