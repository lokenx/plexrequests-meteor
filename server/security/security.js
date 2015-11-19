Settings.permit('update').ifLoggedIn().apply();

Accounts.validateNewUser(function (user) {
  if (Meteor.users.find({}).count() === 0)
    return true;

  logger.error("Only one admin user is allowed!");
  throw new Meteor.Error(431, "Only one admin user is allowed!");
});
