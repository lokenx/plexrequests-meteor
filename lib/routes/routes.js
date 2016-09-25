var base = '';

if (Meteor.absoluteUrl().split('/')[3] !== '') {
  base = '/' + Meteor.absoluteUrl().split('/')[3];
}

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  progressSpinner : false
});

Router.route(base, {
  name: 'home',
  template: 'home',
  onBeforeAction: function () {
    if (Session.get("auth") === "true") {
      this.render('homealt')
    } else {
      this.next();
    }
  },
  onAfterAction: function() {
    document.title = 'Plex Requests';
  }
});

Router.route(base + '/search', {
  name: 'search.page',
  template: 'search',
  waitOn: function () {
    return [Meteor.subscribe('movies'),Meteor.subscribe('tv')];
  },
  onBeforeAction: function () {
    if (Session.get("auth") === "true") {
      this.next();
    } else {
      this.redirect('home');
    }
  },
  onAfterAction: function() {
    document.title = 'Search - Plex Requests';
  }
});

Router.route(base + '/requests', {
  name: 'requests.page',
  template: 'requests',
  waitOn: function () {
    return [Meteor.subscribe('movies'),Meteor.subscribe('tv')];
  },
  onBeforeAction: function () {
    if (Session.get("auth") !== "true" && !Meteor.userId()) {
      this.redirect('home');
    } else {
      this.next();
    }
  },
  onAfterAction: function() {
    document.title = 'Requests - Plex Requests';
  }
});

Router.route(base + '/admin', {
  name: 'admin.page',
  template: 'admin',
  onBeforeAction: function () {
    if (Meteor.userId()) {
      Meteor.subscribe('settings');
      Meteor.subscribe('permissions');
      this.next();
    } else {
      this.render('admin')
    }
  },
  onAfterAction: function() {
    document.title = 'Admin - Plex Requests';
  },
  data: function () {
    return Settings.findOne({})
  }
});
