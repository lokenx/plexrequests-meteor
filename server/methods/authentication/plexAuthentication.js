Meteor.methods({

    'checkPlexAuthentication': function () {
        return Settings.find({}).fetch()[0].plexAuthenticationENABLED
    },

    'checkPlexAuthenticationPasswords': function () {
        return Settings.find({}).fetch()[0].plexAuthenticationPASSWORDS
    },

    'plexLogin': function (username, password) {
        check(username, String)
        check(password, String)

        try {
            var requestAuth = Meteor.http.call('POST', 'https://plex.tv/api/v2/users/signin', {
                headers: {
                    'Accept': 'application/json',
                    'X-Plex-Client-Identifier': 'BGZQ8N25FYP3UHB6',
                    'X-Plex-Version': '1.2.0',
                    'X-Plex-Platform': 'Meteor',
                    'X-Plex-Device-Name': 'Plex Requests'
                },
                data: {
                    'login': username,
                    'password': password,
                    'rememberMe': false
                }

            })


            var plexData = JSON.parse(requestAuth.content)


        } catch (error) {
            logger.error(plexData.errors[0].message)
            throw new Meteor.Error(401, plexData.errors.error[0])
        }

        if (requestAuth.statusCode === 201) {
            return plexData
        }

    },

    'checkPlexUser': function (plexLogin, plexPassword) {
        check(plexLogin, String)
        check(plexPassword, String)

        if (Settings.find({}).fetch()[0].plexAuthenticationPASSWORDS) {
            // If passwords are required check full login
            var userInfo = Meteor.call('plexLogin', plexLogin, plexPassword)
            var plexUsername = userInfo.username
        }

        //Update users in permissions
        Meteor.call('permissionsUpdateUsers')

        //Get friendslist and bannedlist
        var friendsList = Meteor.call('getPlexFriendlist')
        var bannedList = Permissions.find({permBANNED: true}, {fields: {_id: 0, permUSER: 1, permBANNED: 1}}).fetch()

        //Remove banned users
        for (var i = 0; i < bannedList.length; i++) {
            friendsList.splice(friendsList.indexOf(bannedList[i].permUSER), 1)
        }

        return (friendsList.indexOf(plexUsername.toLowerCase()) > -1)
    },

    'getPlexToken': function (plexLogin, plexPassword) {
        check(plexLogin, String)
        check(plexPassword, String)

        if (plexLogin !== '' && plexPassword !== '') {
            var userInfo = Meteor.call('plexLogin', plexLogin, plexPassword)
            var plexAuth = userInfo.authToken
        } else {
            logger.error('Missing login or password')
            throw new Meteor.Error(401, 'Must supply a valid login and password')
        }

        //Bad authentication comes back as 401, will need to add error handles, for now it just assumes that and lets user know
        if (plexAuth) {
            Settings.update({}, {$set: {plexAuthenticationTOKEN: plexAuth}})
            return true
        } else {
            logger.error('Error getting Plex token')
        }
    },

    'getPlexFriendlist': function () {
        var plexToken = Settings.find({}).fetch()[0].plexAuthenticationTOKEN

        try {
            var friendsXML = Meteor.http.call('GET', 'https://plex.tv/pms/friends/all?X-Plex-Token=' + plexToken)
            var accountXML = Meteor.http.call('GET', 'https://plex.tv/users/account?X-Plex-Token=' + plexToken)
        } catch (error) {
            logger.error('Error checking Plex Users: ' + error.message)
            return false
        }

        var users = []
        var admintitle = ''

        xml2js.parseString(friendsXML.content, {mergeAttrs: true, explicitArray: false}, function (err, result) {
            users = result['MediaContainer']['User']
        })

        xml2js.parseString(accountXML.content, {mergeAttrs: true, explicitArray: false}, function (err, result) {
            admintitle = result['user']['title'].toLowerCase()
        })

        var friendsList = []

        // Check if an array of users or a single user is returned
        if (typeof users !== 'undefined') {
            if (users.length) {
                for (var i = 0; i < users.length; i++) {
                    friendsList.push(users[i].title.toLowerCase())
                }
            } else if (users.title) {
                friendsList.push(users.title.toLowerCase())
            }
        }

        //Add admin username to the list
        friendsList.push(admintitle)

        return (friendsList)
    }
})
