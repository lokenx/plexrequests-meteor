Meteor.methods({
    // Pretty simple, pass a user and the request type and the function returns true if they need approval
    // and false if they don't
    'approvalCheck': function (user, requestType) {
        var settings = Settings.find({}).fetch()
        var movieApproval = settings.movieApproval
        var tvApproval = settings.tvApproval

        Label:if (requestType === 'movie') {
            if (!movieApproval) {
                {
                    return false
                }
            } else {
                {
                    break Label
                }
            }
        } else if (requestType === 'tv') {
            if (!tvApproval) {
                {
                    return false
                }
            } else {
                {
                    break Label
                }
            }
        }

        if (settings.plexAuthenticationENABLED) {
            return (Permissions.find({permUSER: user}).fetch()[0].permAPPROVAL)
        } else{
            return false
        }
    },

    'limitCheck': function (user, requestType) {
        var weeklyLimit = Settings.find({}).fetch()[0].movieWeeklyLimit
        var userUnlimited = Permissions.find({permUSER: user}).fetch()[0].permLIMIT
        if (Meteor.user() || userUnlimited || weeklyLimit) {
            return false
        }
        if (requestType === 'movie') {
            var userRequestTotal = Movies.find({
                user: user,
                createdAt: {'$gte': Date.now() - 6.048e8}
            }).fetch().length
        } else if (requestType === 'tv') {
            userRequestTotal = TV.find({
                user: user,
                createdAt: {'$gte': Date.now() - 6.048e8}
            }).fetch().length
        } else {
            userRequestTotal = 0
        }
        return (userRequestTotal >= weeklyLimit)
    }
})