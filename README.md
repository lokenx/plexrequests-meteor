#Plex Requests - Meteor Style!

![plexrequestshomepage](Screenshot03.png)

This is [Plex Requests](https://github.com/lokenx/plexrequests) but written with Meteor! It's been updated with [SickRage](https://github.com/SiCKRAGETV/SickRage) and [Sonarr](https://sonarr.tv/) (currently beta) intergration, includes a new admin interface courtesy of the [Houston](https://github.com/gterrono/houston) package, and now supports authentication via Plex.tv usernames!

**A project website has been setup using [GitHub pages](http://plexrequests.8bits.ca/), please visit it for more details!**

##Features
* Accounts are here! User's simply need enter their Plex.tv usernames to gain access
* Users can search the [The MovieDB](https://www.themoviedb.org/) for movies and TV series to request
* Requested content is easily available for users to see, and downloaded content gets cleaned up from the list
* Adminitrators can view and edit requests using the admin interface, as well as configure settings
* Couch Potato, SickRage, Sonarr, PushOver and PushBullet can be integrated via the admin interface
 * With CP enabled, movies are added to CP Wanted List if not present already, and an option to update movies download status is provided to users
 * SickRage/Sonarr integration allows shows to be added to your watch list for automated downloading
 * PushBullet and PushOver notifications can be sent to give you a notification when something is requested
* Test pages is now setup that should help diagnose and troubleshoot connectivity issues, links can be found in admin interface

![Plex Authentication](Screenshot10.png)

##Installation
Installation is straightforward: please update to Meteor 1.1 (for Windows support), clone the repo, `cd` into the directory, and run `meteor`. For Windows users check out this [blog post](http://8bits.ca/blog/installing-plexrequests-windows/) for installation instructions using Git!

On first run navigate to `http://localhost:3000/admin` and create an admin account with an username and password. **If this isn't done someone else can create the admin account to your applications.** This account is only used for logging in, email integration isn't enabled. Once logged in, please visit the status and setup pages for the various services as linked to in the admin interface to get started.

##FAQ
Please visit the projects [GitHub page](http://plexrequests.8bits.ca/) for [FAQ page](http://plexrequests.8bits.ca/faq)

##Contributors
Plex Authentication: [@jeradin](https://github.com/Jeradin)
##License
This application is licensed under The MIT License. The Plex logo, and name are copyright of Plex Inc.
