Router.route('/', function () {
    this.render('home');
});

Router.route('/requests', function () {
	this.render('requests');
})
