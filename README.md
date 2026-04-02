ToDo:
    - create custom hooks to simplify code
    - add react native toast for quick messages (i.e 'Notification Sent)
    - handle error messages accordingly with UI prompts instead of console logs
    - check to see all error message are red and not Colors.redButton
    - check to see if pages need refresh added to them
    - check modals in layouts for styling and functionality
    - handle notification when a truck driver accepts a request and an admin marks it as completed (using two phones for real time viewing)
    - check if you can replace useState variables with useRef variables
    - check if you can add useMemos for calculations in app
    - review what custom notification is for in homePage index.jsx
    - reformat code (i.e put useEffects in one section, variables in another etc.)
    - check if i need to run get/setters right after using a create in graphql. i.e using getvehicles after creatVehicle in handleCreateVehicle function
    - review logic for app i.e. why do i need to use async local storage etc.
    - condense code into functions in _layout files and wherever else necessary for readability and shorter code
    - handle env variables properly
    - need to test pretty much everything since update to SDK 55. DO THIS LAST

PotentialChanges:
    - create info tabs to replace tabs with no onPress functions
    - use Notification to trigger useEffect rerender to refresh screens instead of sending the actual data.
    - Add notification tab in header for home page (only do this if you add a datamodel for notifications)
    - Add dataModel to save data for notifications instead of sending data directly through a notification
    - newEstimate and newInvoice do not update if you launch the app from the terminated state by clicking on the app itself (Adding dataModel for notification data would fix this)
    - move initialize app functions to components file
    - make a function to catch certain error messages so i can output my desired user friendly error message
    - add navigation screen that doesnt compute bearing in case phone doesnt have a bearing sensor (rare) OR don't allow navigation if no bearing sensor
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