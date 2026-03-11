ToDo:
    - handle notification when a truck driver accepts a request and an admin marks it as completed (using two phones for real time viewing)
    - header styling on different device
    - towRequest.jsx check why im sending that data through notifications to admin and tow drivers
    - test vehicle pickup from customer POV
    - test UI for appointment and tow request from admin and tow driver point of view if the user deletes the vehicle with an active request.
    - RFValue package might be deprecated. check
    - Add call customer or email customer button to user view and vehicle view sections
    - check to see if pages need refresh added to them
    - add try/catch to functions and buttons
    - check to see all error message are red and not Colors.redButton
    - test UI in admin for if a customer makes a request or appointment and then deletes vehicle
    - changing bouncing icon animation to a moving border animation
    - Schedule a vehicle pickup
    - check vehicle has been picked up refresh bug
    - need to test pretty much everything since update to SDK 55. DO THIS LAST

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

conventional commits guide:

feat — adding new functionality. e.g. feat: add appointment scheduling screen
fix — fixing a bug. e.g. fix: vehicle not loading when null
refactor — changing code without adding features or fixing bugs, like restructuring or cleaning up. e.g. refactor: move VehicleItem to its own component file
style — formatting changes only, no logic changes. e.g. style: fix indentation in AppointmentScreen — note this is code style not UI style
chore — maintenance tasks that don't affect the app's functionality. e.g. chore: update dependencies
docs — documentation changes only. e.g. docs: update README with setup instructions
perf — changes that improve performance. e.g. perf: replace FlatList with SimpleList on short lists
build — changes to the build system or dependencies. e.g. build: upgrade expo SDK to 51
ci — changes to CI/CD configuration files. e.g. ci: add EAS build workflow
test — adding or updating tests. e.g. test: add unit tests for getDaysInMonth
revert — reverting a previous commit. e.g. revert: feat: add appointment scheduling screen