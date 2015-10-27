# Plex Requests - Meteor Style!

This is an early **ALPHA** release of the next version of Plex Requests! Please be aware that things will break, that I am 100% certain of.

**WARNING**

Under no circumstances should you update your existing installation with this one. Create a separate folder, and install a fresh copy. The Settings side of things have been completed re-worked and I'm brainstorming ways to best moves your settings over when you upgrade. In addition more data is stored for requests (and some formats changed) and this hasn't been tested yet in an upgrade process.

Again--**DO NOT UPGRADE**--create a new installation to test and play around with.

If you do upgrade, please not your existing settings will be printer to the server log, and be deleted from the app. Your admin account will remain in place however. This is done because the settings data is stored entirely differently and is not compatible.

On first run navigate to http://localhost:3000/admin and create an admin account with an username and password. If this isn't done someone else can create the admin account to your applications. A notice will be added regarding this on start-up.

**Things That Work**

  - Searching for Movies / TV Shows
  - Requesting Movies / TV Shows
  - Approving / Deleting / Issues
  - Requests List Page
  - Settings Page (available at `/admin`)
  - Download status of Movies / TV Shows
  - Sorting and filter options for Requests page
  - Alerts via either service
  - Connectivity Tests for CouchPotato/SickRage/Sonarr/Pushover/Pushbullet
  - Retrieve Plex token

Please report any and all issues as you come across them. I'm actively working on this branch so check back often for new updates.

##License
This application is licensed under The MIT License. The Plex logo, and name are copyright of Plex Inc.
