Meteor.startup(function () {
  //creating a global server logger
  logger = Meteor.npmRequire('winston');
  var appPath = process.env.PWD;

  logger.add(logger.transports.File, {
    filename: appPath + '/logs.log',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    exitOnError: false
  });

  logger.remove(logger.transports.Console);

  logger.add(logger.transports.Console, {
    handleExceptions: true,
    humanReadableUnhandledException: true,
    exitOnError: false
  });

});
