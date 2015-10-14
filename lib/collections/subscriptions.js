if (Meteor.isClient) {
  Meteor.subscribe("settings");
  Meteor.subscribe("movies");
}
