Meteor.methods({
    'updateSickRage' : function () {
        var tv = TV.find({approval_status: 1})

        tv.forEach(function (show) {
            var status = SickRage.statsShow(show.tvdb)
            TV.update(show, {$set: {status: status}})
        })
        SickRage.log('info', 'Series update check run successfully')
        return true
    }
})
