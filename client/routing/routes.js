Router.configure({
  layoutTemplate: 'home'
});

Router.route('/search', function () {
  this.render('search');
});

Router.route('/requests', function () {
	this.render('requests');
});

