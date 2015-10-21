Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  if (Session.get("auth")) {
		this.redirect('search');
	} else {
		this.render('home');
	}
});

Router.route('/search', function () {
  if (Session.get("auth")) {
		this.render('search');
	} else {
		this.redirect('/');
	}
});

Router.route('/requests', function () {
	if (Session.get("auth")) {
		this.render('requests');
	} else if (Meteor.userId()) {
		this.render('requests');
	} else {
		this.redirect('/');
	}
});

Router.route('/admin', function () {
	this.render('admin');
})