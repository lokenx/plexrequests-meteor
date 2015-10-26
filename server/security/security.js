Settings.permit('update').ifLoggedIn().apply();

// Only allow a single admin
if (Meteor.users.find({}).count() != 0) {
  Accounts.config({
    forbidClientAccountCreation : true
  });
}

// Validate username, sending a specific error message on failure.
Accounts.validateNewUser(function (user) {
  if (Meteor.users.find({}).count() === 0)
    return true;
  throw new Meteor.Error(431, "Only one admin user is allowed!");
});
