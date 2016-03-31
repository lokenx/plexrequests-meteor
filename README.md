# Plex Requests - Meteor Style!

![plexrequestspreview](http://plexrequests.8bits.ca/img/preview.png "PlexRequests")

[![Join the chat at https://gitter.im/lokenx/plexrequests-meteor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/lokenx/plexrequests-meteor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/lokenx/plexrequests-meteor.svg)](http://isitmaintained.com/project/lokenx/plexrequests-meteor "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/lokenx/plexrequests-meteor.svg)](http://isitmaintained.com/project/lokenx/plexrequests-meteor "Percentage of issues still open")
> This is [Plex Requests](https://github.com/lokenx/plexrequests) but written with Meteor! It's been updated with an approval system, basic issue reporting, and a new visual style!

**Interested in a cross platform .Net Plex Requests? Check out [Plex Requests.Net](https://github.com/tidusjar/PlexRequests.Net)!**

## Features
* Users can easily search the [TheMovieDB](https://www.themoviedb.org/) for content to request
* Easily accessible list of requested Movies and TV series
* Simple and easy user authentication and request approval
* [CouchPotato](https://couchpota.to/) integration for automatic downloads of Movies
* [SickRage](https://github.com/SickRage/SickRage) and [Sonarr](https://sonarr.tv/) integrationed for automatic TV Series downloads
* [Pushbullet](https://www.pushbullet.com/), [Pushover](https://pushover.net/) and [Slack](https://slack.com/) notifications to keep up to date with requests
    * You can now push notifications to a custom channel to easily notify others whenever new content is requested and added. Users only need to
        subscribe to the channel to start recieving notifications. Visit the [Channel Creation Page](https://www.pushbullet.com/my-channel) to learn more about how to create and distribute your own channel.

## Installation
Installation is straightforward: please update to Meteor 1.2.1, clone the repo, `cd` into the directory, and run `meteor`. For Windows users check out this [blog post](http://8bits.ca/posts/2015/installing-plex-requests-on-windows/) for installation instructions using Git!

On first run navigate to `http://localhost:3000/admin` and create an admin account with an email address and password. **If this isn't done someone else can create the admin account to your application.** This account is only used for logging in, email integration isn't enabled. Once logged in, you can configure your settings and get things going.

## Docker
To use the bundled docker-compose simply run it with

```docker-compose up```

(add -d to run it as a daemon)

## FAQ
Please visit the projects [GitHub page](http://plexrequests.8bits.ca/) for [FAQ page](http://plexrequests.8bits.ca/faq)

## Contributors
 [@leonkunert](https://github.com/leonkunert) / [@jeradin](https://github.com/Jeradin) / [@jrudio](https://github.com/jrudio) / [@drzoidberg33](https://github.com/drzoidberg33) / [@SmallwoodDR82](https://github.com/SmallwoodDR82) / [@camjac251](https://github.com/camjac251)

## Want to help out?
Want to  make Plex Requests more awesome? Feel free to fork the repo and submit a pull request! Not a developer or rather not get your hands dirty? You can donate via [PayPal](https://www.paypal.me/plexrequests) to keep things going, or just simply to say thanks!

## License
This application is licensed under The MIT License. The Plex logo, and name are copyright of Plex Inc.
