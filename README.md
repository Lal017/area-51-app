ToDo:
    - Add appointments to google calendar and make visual calendar for app to display appointments
    - Try to make styling for tow request look better and maybe also for scheduling
    - Try to make styling for admin pages better
    - update notification listeners for Admins and TowDrivers
    - fix handleResetPassword error message codes
    - upload drivers coordinates to database from location subscription
    - use a subscription to listen for updates to tow drivers coordinates in database for customer and then display these coordinates on a map.
    - signing in with google or amazon re-sets attributes after every login
    - use a notification or a database listener to end the location task from the admin console

PotentialChanges:
    - Add notification tab in header for home page (only do this if you add a datamodel for notifications)
    - Add dataModel to save data for notifications instead of sending data directly through a notification
    - newEstimate and newInvoice do not update if you launch the app from the terminated state by clicking on the app itself (Adding dataModel for notification data would fix this)
    - move initialize app functions to components file
    - make a function to catch certain error messages so i can output my desired user friendly error message
    - add button to view password when inputing it