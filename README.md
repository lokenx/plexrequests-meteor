# Plex Requests - Meteor Style!

 ![plexrequestspreview](http://plexrequests.8bits.ca/img/preview.png "PlexRequests")

 [![Join the chat at https://gitter.im/lokenx/plexrequests-meteor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/lokenx/plexrequests-meteor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/lokenx/plexrequests-meteor.svg)](http://isitmaintained.com/project/lokenx/plexrequests-meteor "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/lokenx/plexrequests-meteor.svg)](http://isitmaintained.com/project/lokenx/plexrequests-meteor "Percentage of issues still open")
 > This is [Plex Requests](https://github.com/lokenx/plexrequests) but written with Meteor! It's been updated with an approval system, basic issue reporting, and a new visual style!

---

### :warning: Warning regarding Meteor 1.3 :warning:

   Meteor recently updated to 1.3, and while we don't expect any issues we advise you don't update your installation yet. You will get prompted to run `meteor update` once the update has downloaded in the background. Please refrain from running it, until we can confirm everything will continue to work.

   **Interested in a cross platform .Net Plex Requests? Check out [Plex Requests.Net](https://github.com/tidusjar/PlexRequests.Net)!**

---

## Overview

   * Movie data is searched and retrieved from [TheMovieDB](https://www.themoviedb.org/)
   * TV Show data is searched and retrieved from [TVMaze](http://www.tvmaze.com/)
   * Easily accessible list of requested Movies and TV series
   * Simple and easy user authentication and request approval
   * Improved user permissions management :star2:

## Downloader Integrations

   * **[CouchPotato](https://couchpota.to/)** Automated Movie Download Application
   * **[SickRage](https://github.com/SickRage/SickRage)** Automated TV Series Download Application
   * **[Sonarr](https://sonarr.tv/)** Automated TV Series Download Application

## Notifications

   * **Providers**
      1. **[Pushbullet](https://www.pushbullet.com/)**
      2. **[Pushover](https://pushover.net/)**
      3. **[Slack](https://slack.com/)**

   * **Pushbullet Channels**
      * You can now push notifications to a custom channel to easily notify others whenever new content is requested and added. Users only need to subscribe to the channel to start recieving notifications.
      * Visit the **[Channel Creation Page](https://www.pushbullet.com/my-channel)** to learn more about how to create and distribute your own channel.

   * **Custom Notifications**
      * Users can customize both the Notifications Title as well as the Notifications body. You can access this from the "Notifications" section of the admin panel.
      * We've added the ability to create dynamic custom notifications through the use of tags; The available tags are listed and described below:
         * **\<type\>**   - Type of request that was made, either a "Movie" or "TV"
         * **\<user\>**   - The user that placed the request
         * **\<issues\>** - The issues associated with the request
         * **\<year\>**   - Year the requested content was released. For TV shows, this is the year the first episode aired.
         * **\<link\>**   - The link to the requested medias TVDB/TVMaze information page.

      * These tags can be used anywhere in the Notifications body and title. The default settings are an example how to utilize the tags in your messages.

## Installation
   * Installation is straightforward: please update to Meteor 1.2.1, clone the repo, `cd` into the directory, and run `meteor`. For Windows users check out this **[blog post](http://8bits.ca/posts/2015/installing-plex-requests-on-windows/)** for installation instructions using Git!

   * On first run navigate to `http://localhost:3000/admin` and create an admin account with an email address and password. **If this isn't done someone else can create the admin account to your application.** This account is only used for logging in, email integration isn't enabled. Once logged in, you can configure your settings and get things going.

   * **Docker**
      * To use the bundled docker-compose simply run it with

         ```docker-compose up```

         (add -d to run it as a daemon)

---

## FAQ
Please visit the projects [GitHub page](http://plexrequests.8bits.ca/) for [FAQ page](http://plexrequests.8bits.ca/faq)

## Contributors
 [@rigrassm](https://github.com/rigrassm) / [@Qw-in](https://github.com/Qw-in) / [@leonkunert](https://github.com/leonkunert) / [@jeradin](https://github.com/Jeradin) / [@jrudio](https://github.com/jrudio) / [@drzoidberg33](https://github.com/drzoidberg33) / [@SmallwoodDR82](https://github.com/SmallwoodDR82) / [@camjac251](https://github.com/camjac251)

## Want to help out?
Want to  make Plex Requests more awesome? Feel free to fork the repo and submit a pull request! Not a developer or rather not get your hands dirty? You can donate via [PayPal](https://www.paypal.me/plexrequests) to keep things going, or just simply to say thanks!

## License
This application is licensed under The MIT License. The Plex logo, and name are copyright of Plex Inc.
