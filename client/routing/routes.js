Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  progressSpinner : false
});

Router.route('/', function () {
  if (Session.get("auth")) {
		this.redirect('search');
	} else {
		this.render('home');
	}
});

Router.route('/search', {
  name: 'search',
  waitOn: function () {
    return [Meteor.subscribe('movies'),Meteor.subscribe('tv')];
  },
  onBeforeAction: function () {
    if (Session.get("auth")) {
      this.next();
    } else {
      this.redirect('/');
    }
  }
});

Router.route('/requests', {
  name: 'requests',
  waitOn: function () {
    return [Meteor.subscribe('movies'),Meteor.subscribe('tv')];
  },
  onBeforeAction: function () {
    if (!Session.get("auth") && !Meteor.userId()) {
      this.redirect('/');
    } else {
      this.next();
    }
  }
});

Router.route('/admin', {
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
