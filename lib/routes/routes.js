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
  onBeforeAction: function () {
    if (Session.get("auth")) {
  		this.redirect('search');
  	} else {
  		this.next();
  	}
  }
});

Router.route(base + '/search', {
  name: 'search',
  waitOn: function () {
    return [Meteor.subscribe('movies'),Meteor.subscribe('tv')];
  },
  onBeforeAction: function () {
    if (Session.get("auth")) {
      this.next();
    } else {
      this.redirect(base);
    }
  }
});

Router.route(base + '/requests', {
  name: 'requests',
  waitOn: function () {
    return [Meteor.subscribe('movies'),Meteor.subscribe('tv')];
  },
  onBeforeAction: function () {
    if (!Session.get("auth") && !Meteor.userId()) {
      this.redirect(base);
    } else {
      this.next();
    }
  }
});

Router.route(base + '/admin', {
  name: 'admin',
  onBeforeAction: function () {
    if (Meteor.userId()) {
      Meteor.subscribe('settings');
     this.next();
    } else {
      this.render('admin')
    }
  },
  data: function () {
   return Settings.findOne({})
 }
});
