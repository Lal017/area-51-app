ToDo:
 -> - Add appointments to google calendar
    - Try to make styling for tow request look better and maybe also for scheduling
    - Try to make styling for admin pages better
    - fix handleResetPassword error message codes
    - use a notification or a database listener to end the location task from the admin console
    - add button to view password when inputing it

PotentialChanges:
    - Add notification tab in header for home page (only do this if you add a datamodel for notifications)
    - Add dataModel to save data for notifications instead of sending data directly through a notification
    - newEstimate and newInvoice do not update if you launch the app from the terminated state by clicking on the app itself (Adding dataModel for notification data would fix this)
    - move initialize app functions to components file
    - make a function to catch certain error messages so i can output my desired user friendly error message
    - update notification listeners for Admins and TowDrivers