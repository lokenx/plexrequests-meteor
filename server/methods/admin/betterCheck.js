Meteor.methods({
    checksWrapper: function (checks) {
        try{
            for(var key in checks) {
                if(checks.hasOwnProperty(key)) {
                    var c = checks[key]
                    check(c.val, c.type)
                }
            }
        } catch (e) {
            return 'Check Fail: '+ key + ' - ' + e.message
        }
        return true
    }
})