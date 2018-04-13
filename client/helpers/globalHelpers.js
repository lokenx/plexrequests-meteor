Template.registerHelper('plexUser', function () {
    return Session.get('user')
})

Template.registerHelper('auth', function () {
    var auth = function () {
        if (Session.equals('auth', 'true')) {
            return true
        } else if (Meteor.userId()) {
            return true
        } else {
            return false
        }
    }
    return auth()
})

Template.registerHelper('plexAuth', function () {
    return Session.equals('auth', 'true')
})
