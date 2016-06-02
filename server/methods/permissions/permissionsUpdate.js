Meteor.methods({
	'permissionsUpdateUsers' : function () {
		
		function isInArray(value, array) {
		  return array.indexOf(value) > -1;
		}
		
		//Get friend and permissions arrays
		var friendsList = Meteor.call("getPlexFriendlist");
		var permList = Permissions.find({}, {fields: {_id: 0, permUSER: 1}}).fetch();
		
		//Add users to permissions
		if(permList.length < friendsList.length) {
			
			for(var i = 0; i < friendsList.length; i++) {
				try {
					Permissions.upsert(
						{permUSER: friendsList[i]},
						{$set: {permUSER: friendsList[i]}}
					);
				} catch (error) {
					logger.error(error.message);
					return false;
				}
			}
		}
		
		//Remove users from permissions
		else if(permList.length > friendsList.length) {
			
			for(var i = 0; i < permList.length; i++) {
				
				if(!isInArray(permList[i].permUSER, friendsList)) {
				   try {
						Permissions.remove(
							{permUSER: permList[i].permUSER}
						);
					} catch (error) {
						logger.error(error.message);
						return false;
					}
				}
			}
		}
	}
});
