# Database Schemas

Currently the Movies, TV, and Settings collections are pretty rough. I need to come up with a uniform schema, as well as determine what to do with the Settings collection.

### Current DB Layouts

#### Movies

|       KEY     |    Value   
|---------------|------------
| _id           | Unique ID  
| title         | Movies title 
| id            | TheMovieDB ID
| imdb          | IMDB ID
| released      | Release date
| user          | Requesting user
| downloaded    | Status of downloaded content
| createdAt     | Date of request

**Field to add**: `{ approved : false }`


#### TV Shows

|       KEY     |    Value   
|---------------|------------
| _id           | Unique ID  
| title         | TV show title 
| id            | TheMovieDB ID
| tvdb          | TVDB ID
| released      | Release date
| user          | Requesting user
| downloaded    | Status of downloaded content
| createdAt     | Date of request

**Field to add**: `{ approved : false }`


#### Settings

There is no schema for settings as each option has different fields. Below is a list of such fields for each service.

**Weekly Limit**:

    {
        _id: weeklylimit,               // Unique ID
        service: User request limit,    // Service
        api: 5                          // Movies and TV independent request limit
    }

**Plex Setting**:

    {
        _id: plexsettings,      // Unique ID
        service: Plex,          // Service
        api: Plex Token,        // Plex Media Server admin Plex.tv token
        enabled: false          // Status
    }

**CouchPotato**:

    {
        _id: couchpotatosetting,                                  // Unique ID
        service: CouchPotato,                                     // Service
        api: http://192.168.0.1:5050/api/abcdef0123456789/,       // CouchPotato Server API URL
        enabled: false                                            // Status        
    }

**SickRage**:

    {
        _id: sickragesetting,                                  // Unique ID
        service: SickRage,                                     // Service
        api: http://192.168.0.1:8081/api/abcdef0123456789/,    // SickRage Server API URL
        enabled: false                                         // Status        
    }

**Sonarr**:

    {
        _id: sonarrsetting,                                 // Unique ID
        service: Sonarr,                                    // Service
        api: http://192.168.0.1:8989,                       // Sonarr Server URL
        api_key: abcdef0123456789,                          // Sonarr Server API key
        qualityProfileId: 1,                                // Sonarr download profile ID
        rootFolderPath: /path/to/root/tv/folder/,           // Sonarr download root folder
        seasonFolder: true,                                 // Sonarr season folder preference
        enabled: false                                      // Status        
    }

**Pushbullet**:

    {
        _id: pushbulletsetting,   // Unique ID
        service: Pushbullet,      // Service
        api: abcdef0123456789,    // Pushbullet API
        enabled: false            // Status        
    }

**Pushover**:

    {
        _id: pushoversetting,     // Unique ID
        service: Pushover,        // Service
        api: abcdef0123456789,    // Pushbullet API
        enabled: false            // Status        
    }


#### Moving forward with settings

I think I am going to try and use a JSON file for the settings going forward, using the Check package to confirm input is valid. I also want to break up the URL and API values for CouchPotato/Sickrage for easier user entry.

Details can be saved in a `settings-user.json` file, with a default `settings-default.json` from where the user file can be created on start-up the first time. A `.gitignore` line for the user file must be added so it doesn't get committed to Git.

In addition a few new settings will need to be added as outlined below.

**Search Options**: This is to allow choosing which type of content users are allowed to request

    {
        movies: true,
        tv: true,
        music: false
    }


**Approval Required**: This is to determine whether requests are approved automatically

    {
        enabled: false
    }
