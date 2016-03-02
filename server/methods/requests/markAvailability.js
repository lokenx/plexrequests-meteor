Meteor.methods({
	"markAvailability": function(movie, status) {
        check(movie, Object);
        check(status, Boolean);

        Movies.update(movie._id, {$set: { downloaded: status}}, function (err, res) {

            if (err) {
                throw err;
            }
            return res;
        });
    }
});
