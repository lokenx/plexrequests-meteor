Meteor.methods({
    'permissionsUpdateUsers' : function () {
		
        function isInArray(value, array) {
		  return array.indexOf(value) > -1
        }

        function addUsers(friends) {
            for(var i = 0; i < friends.length; i++) {
                try {
                    Permissions.upsert(
                        {permUSER: friends[i]}, 
                        {$set: {permUSER: friends[i]}}
                    )
                } catch (error) {
                    logger.error(error.message)
                    return false
                }
            }
        }

        function removeUsers(friends, perms) {
            for(var i = 0; i < perms.length; i++) {
                if(!isInArray(perms[i].permUSER, friends)) {
                   try {
                        Permissions.remove(
                            {permUSER: perms[i].permUSER}
                        )
                    } catch (error) {
                        logger.error(error.message)
                        return false
                    }
                }
            }
        }

        function updateUsers(friends, perms) {
            addUsers(friends)
            removeUsers(friends,perms)
        }
		
        //Get friend and permissions arrays
        var friendsList = Meteor.call('getPlexFriendlist')
        var permList = Permissions.find({}, {fields: {_id: 0, permUSER: 1}}).fetch()

        updateUsers(friendsList, permList)
    }
})
