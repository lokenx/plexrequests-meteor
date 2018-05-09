Meteor.methods({
    'updateSonarr' : function () {
        var tv = TV.find({approval_status: 1})

        tv.forEach(function (show) {
            var status = Sonarr.seriesStats(show.tvdb)
            if (status) {
                TV.update(show, {$set: {status: status}})
            }
        })
        Sonarr.log('info', 'Series update check run successfully')
        return true
    }
})
