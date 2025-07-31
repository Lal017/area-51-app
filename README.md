ToDo:
    - fix handleResetPassword error message codes
    - make sure two truck drivers cant accept the same request
    - handle notification when a truck driver accepts a request and an admin marks it as completed
    - DECIDE IF YOU SHOULD KEEP APPOINTMENT LIST OR NOT

PotentialChanges:
    - Add notification tab in header for home page (only do this if you add a datamodel for notifications)
    - Add dataModel to save data for notifications instead of sending data directly through a notification
    - newEstimate and newInvoice do not update if you launch the app from the terminated state by clicking on the app itself (Adding dataModel for notification data would fix this)
    - move initialize app functions to components file
    - make a function to catch certain error messages so i can output my desired user friendly error message
    - update notification listeners for Admins and TowDrivers
    - Add appointments to google calendar