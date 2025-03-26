import { Amplify } from "aws-amplify";
import awsconfig from "../src/amplifyconfiguration.json";
import { Stack } from "expo-router";
import { useEffect } from "react";
import {
  initializePushNotifications,
  onNotificationReceivedInBackground,
  onNotificationReceivedInForeground,
  onNotificationOpened,
  getLaunchNotification
} from "aws-amplify/push-notifications";

Amplify.configure(awsconfig);
initializePushNotifications();

const RootLayout = () =>
{
  useEffect(() => {
    const foregroundListener = onNotificationReceivedInForeground((notification) => {
      console.log('Notification received in foreground:', notification);
    });
    const backgroundListener = onNotificationReceivedInBackground((notification) => {
      const launchNotification = getLaunchNotification();
      console.log('Notification received in background:', notification);
    });
    const openedListener = onNotificationOpened((notification) => {
      console.log('Notification opened:', notification);
    });
  
    return () => {
      foregroundListener.remove();
      backgroundListener.remove();
      openedListener.remove();
    };
  }, []);

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name='index' options={{title: 'Home'}}/>
      <Stack.Screen name='(auth)' options={{title: 'Authentication'}}/>
      <Stack.Screen name='(tabs)' options={{title: 'App'}}/>
    </Stack>
  );
}

export default RootLayout;