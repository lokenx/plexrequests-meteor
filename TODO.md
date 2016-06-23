## TODO LIST

- Update couchpotatowrapper to accept profile_id argument
- Modify requests.html to have approve button show a drop down list of CP
  profiles to select from.
- Add button to pull in CP profiles and allow to set a default in Admin section

### NEW AND CHANGED FILES
 * server/methods/helpers/couchpotato/cpProfilesGet.js
 * lib/collections/collections.js (Updated to store CP Profiles)
 * client/templates/requests/requests.js (Added basic profile selection event
   handler)
 * server/methods/requests/approveRequest.js (Added profile_id argument)
 * TODO.md
