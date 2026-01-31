ToDo:
    - handle notification when a truck driver accepts a request and an admin marks it as completed (using two phones for real time viewing)
    - header styling on different device
    - change alerts to more UI friendly messages inside of app
    - handle styling for (service)
 -> - Add react-native-progress package bar to towRequest.jsx
    - RFValue package might be deprecated. check

PotentialChanges:
    - Add notification tab in header for home page (only do this if you add a datamodel for notifications)
    - Add dataModel to save data for notifications instead of sending data directly through a notification
    - newEstimate and newInvoice do not update if you launch the app from the terminated state by clicking on the app itself (Adding dataModel for notification data would fix this)
    - move initialize app functions to components file
    - make a function to catch certain error messages so i can output my desired user friendly error message
    - update notification listeners for Admins and TowDrivers
    - Add appointments to google calendar
    - incorporate more images to make the UI more user friendly
    - try to embed the map instead of using an api key.
    - send a notif to admin after 10 minutes if no tow driver has accepted a request