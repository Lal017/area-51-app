ToDo:
    - Add appointments to google calendar and make visual calendar for app to display appointments
    - Try to make styling for tow request look better and maybe also for scheduling
    - Try to make styling for admin pages better
    - assign driverId field after becoming a towdriver
    - update notification listeners for Admins and TowDrivers
    - add a waiting page for when a user signs up to be a tow driver
    - allow users to request to become a towdriver while inside of the app
    - fix handleResetPassword error message codes

PotentialChanges:
    - Add notification tab in header for home page
    - Add dataModel to save data for notifications instead of sending data directly through a notification
    - newEstimate and newInvoice do not update if you launch the app from the terminated state by clicking on the app itself (Adding dataModel for notification data would fix this)
    - move initialize app functions to components file
    - make a function to catch certain error messages so i can output my desired user friendly error message
    - add button to view password when inputing it