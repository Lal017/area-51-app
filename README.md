ToDo:
    - Add appointments to google calendar and make visual calendar for app to display appointments
    - Try to make styling for tow request look better and maybe also for scheduling
    - Try to make styling for admin pages better
    - allow admin to add users to TowDrivers group and assign driverId field.
    - update notification listeners for Admins and TowDrivers
    - add an option to allow users to sign up to become a tow driver
    - add a waiting page for when a user signs up to be a tow driver
    - fix handleResetPassword error message codes

PotentialChanges:
    - Add notification tab in header for home page
    - Add dataModel to save data for notifications instead of sending data directly through a notification
    - newEstimate and newInvoice do not update if you launch the app from the terminated state by clicking on the app itself (Adding dataModel for notification data would fix this)
    - move initialize app functions to components file
    - make a function to catch certain error messages so i can output my desired user friendly error message
    - add button to view password when inputing it