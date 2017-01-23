Meteor.startup(function () {
  //creating a global server logger
    logger = Meteor.npmRequire('winston');
    var FS = Npm.require('fs');
    var Path = Npm.require('path');
    var meteor_root = FS.realpathSync( process.cwd() + '/../' );
    var application_root = FS.realpathSync( meteor_root + '/../' );

    // if running on dev mode
    if( Path.basename(FS.realpathSync( meteor_root + '/../../../' ) ) == '.meteor' ){
      application_root =  FS.realpathSync( meteor_root + '/../../../../' );
    }

    logger.add(logger.transports.File, {
        filename: Path.join(application_root + '/logs.log'),
        handleExceptions: true,
        humanReadableUnhandledException: true,
        exitOnError: false,
        maxsize: 10000000,
        maxFiles: 3
    });

    logger.remove(logger.transports.Console);

    logger.add(logger.transports.Console, {
        handleExceptions: true,
        humanReadableUnhandledException: true,
        exitOnError: false
    });

});
