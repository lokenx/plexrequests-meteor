Meteor.methods({
    'sendTelegramNotification': function (settings, text) {
        var telegram_url_1 = "https://api.telegram.org/bot"
        var telegram_url_2 = "/sendMessage?chat_id="

        var botAPI = settings.telegramAPI
        var chatID = settings.telegramCHAT

        var telegram_url = telegram_url_1+botAPI+telegram_url_2+chatID

        try {
            HTTP.post(
                telegram_url,
                {
                    params: {
                        text: text,
                        parse_mode: "Markdown"
                    },
                    timeout: 4000
                }
            )
            return true
        } catch (error) {
            var err = error.response.content
            logger.error('Telegram notification error: ' + err)
            throw err
        }
    }
})
