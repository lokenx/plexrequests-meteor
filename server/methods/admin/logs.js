Meteor.methods({
  getLogs: function (start, limit) {
    check(start, Number);
    check(limit, Number);

    var options = {
      from: new Date - 24 * 60 * 60 * 1000,
      until: new Date,
      limit: limit,
      order: 'desc',
      fields: ['message', 'level', 'timestamp']
    };

    function query (start, limit, callback) {
      logger.query(options, function (error, results) {
        if (error) {
          callback(error, null);
        } else {
          callback(null, results);
        }
      })
    }

    var wrapperLogQuery = Async.wrap(query);

    return wrapperLogQuery(0, 10);
  }
});
