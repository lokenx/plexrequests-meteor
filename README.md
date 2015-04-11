#Plex Requests - Meteor Style!

![plexrequestshomepage](Screenshot03.png)

This is [Plex Requests](https://github.com/lokenx/plexrequests) but written with Meteor! It's been updated with [Couch Potato](https://github.com/RuudBurger/CouchPotatoServer) intergration, includes a new admin interface courtesy of the [Houston](https://github.com/gterrono/houston) package, and now supports authentication via Plex.tv usernames!

**A project website has been setup using [GitHub pages](http://8bits.ca/plexrequests-meteor), please visit it for more details!**

##Features
* **NEW** Accounts are here! User's simply need enter their Plex.tv usernames to gain access
* Users can search the [OMDB](http://www.omdbapi.com/) for movies to request
* Requested movies are easily available for users to see, and downloaded content gets cleaned up from the list
* Adminitrators can view and edit requested movies using the admin interface, as well as configure settings
* Couch Potato and PushBullet can be integrated via the admin interface
 * With CP enabled, movies are added to CP Wanted List if not present already, and an option to update movies download status is provided to users
 * **NEW** Movies are also first checked to see if they're already downloaded in CP and let's the users know as such
 * PushBullet notifications can be sent to give you a notification when a movie is requested
* **NEW** A CP test page is now setup at `/couchpotato` that should help diagnose and troubleshoot connectivity issues

![Plex Authentication](Screenshot10.png)

##Installation
Installation is straightforward: please update to Meteor 1.1 (for Windows support), clone the repo, `cd` into the directory, and run `meteor`

On first run navigate to `http://localhost:3000/admin` and create an admin account with an username and password. **If this isn't done someone else can create the admin account to your applications.** This account is only used for logging in, email integration isn't enabled. Once logged in, go to the `setting` collection and enable Couch Potato or PushBullet integration.

For PushBullet just your API key is required and changing the last field to `true`. For CouchPotao you need to enter the full IP address of your server, including port and API. **Please ensure there's a trailing `/` at the end of the URL.** Please see below for an example. You will also need to change the last field to `true`.  

    http://192.168.0.0:5050/api/abcdef1234567890/

To setup authentication to your application please nagivate to `http://localhost:3000/plex` and login with your Plex.tv account or follow the manual instructions provided. You need to be logged in as the admin user to access this page as well.

##Additional Information
If you're having trouble with Couch Potato please visit `http://localhost:3000/couchpotato` (or your own URL) for some assistance, it requires you to be logged in to the admin interface to access. It does quick checks to see if it can connect to Couch Potato.

For authentication issues, `http://localhost:3000/plex` provides information regarding the current status of authentication and connectivity.

##FAQ
Please visit the projects [GitHub page](http://lokenx.github.io/plexrequests-meteor) for [FAQ page](http://lokenx.github.io/plexrequests-meteor/faq)


##Contributors
Plex Authentication: [@jeradin](https://github.com/Jeradin)
##License
This application is licensed under The MIT License. The Plex logo, and name are copyright of Plex Inc.
