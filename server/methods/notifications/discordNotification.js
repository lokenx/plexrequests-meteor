
Meteor.methods({
    'sendDiscordNotification': function(botname, title, body) {
        check(botname, String)
        check(title, String)
        check(body, String)
        try {
            var payload = {content: title + ': ' + body, username: botname}
            var url = 'https://canary.discordapp.com/api/webhooks/439637923776692245/8wlDcEnBXoPUNd9Dfn93ZypuHQL78tmDiIosXMwQDhU677OefViXMKp95whKdbHfFVyp'
            return HTTP.post(url, {headers: {'Content-Type': 'application/json'}, data: payload})
        } catch (e) {console.log(e.message)}
    }
})
