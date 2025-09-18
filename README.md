ToDo:
    - fix handleResetPassword error message codes
    - handle notification when a truck driver accepts a request and an admin marks it as completed
    - DECIDE IF YOU SHOULD KEEP APPOINTMENT LIST OR NOT
    - header styling on different device
    -  (NOBRIDGE) ERROR, could not get last stored location: [TypeError: Cannot read property 'latitude' of null]
    - change react native responsive font size package because it is not longer supported
    - DO NOT PUSH UNTIL HIDE API KEY FOR MAP *********************
    - try to embed the map instead of using an api key.
    - Display UI for route. 
    - set rotation for camera when moving along route
    - handle rerouting

PotentialChanges:
    - Add notification tab in header for home page (only do this if you add a datamodel for notifications)
    - Add dataModel to save data for notifications instead of sending data directly through a notification
    - newEstimate and newInvoice do not update if you launch the app from the terminated state by clicking on the app itself (Adding dataModel for notification data would fix this)
    - move initialize app functions to components file
    - make a function to catch certain error messages so i can output my desired user friendly error message
    - update notification listeners for Admins and TowDrivers
    - Add appointments to google calendar
    - incorporate more images to make the UI more user friendly