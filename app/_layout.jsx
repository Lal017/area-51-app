// CONFIGURATION FOR AMPLIFY DO NOT EDIT
import { Amplify } from 'aws-amplify';
import awsconfig from '../src/aws-exports.js';
Amplify.configure(awsconfig);
// ----------------------------------------------------------------
import Colors from '../constants/colors';
import { handleGetCurrentUser } from '../components/authComponents';
import { Stack } from 'expo-router';
import { setNotificationHandler } from 'expo-notifications';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Hub } from 'aws-amplify/utils';

// Notification handler for recieved notifications
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    vibrationPattern: [0, 200, 200, 200],
    priority: 'high',
  })
});

const RootLayout = () =>
{
  // Font imports
  const [ fontsLoaded ] = useFonts({
    'Roboto-Condensed-Light': require('../assets/fonts/Roboto_Condensed-Light.ttf'),
    'Roboto-SemiCondensed-Bold': require('../assets/fonts/Roboto_SemiCondensed-Bold.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
  });

  // listener for auth event (sign in, sign out). handles redirects
  useEffect(() => {
    const listener = Hub.listen('auth', async (data) => {
      const { payload } = data;
      
      // Handle authentication events
      switch (payload.event) {
        case 'signedIn':
          // Redirect to home screen or dashboard after successful sign in
          const user = await handleGetCurrentUser();
          const isAdmin = user?.accessToken?.payload["cognito:groups"]?.includes('Admins');
          const isDriver = user?.accessToken?.payload["cognito:groups"]?.includes('TowDrivers');
          if (router.canDismiss()) { router.dismissAll(); }
          if (isAdmin) router.replace('(admin)');
          else if (isDriver) router.replace('(tow)');
          else router.replace('(tabs)');
          break;
        case 'signedOut':
          // Redirect to login screen after sign out
          router.replace('(auth)');
          break;
        case 'signedIn_failure':
          // Handle failed sign in
          router.replace('(auth)');
          break;
      }
    });

    return listener; // Clean up the listener on unmount
  }, []);
  
  return (
    <>
      <StatusBar hidden={true} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background
          },
          animation: 'fade_from_bottom'
        }}>
        <Stack.Screen name='index' options={{title: 'Home'}}/>
        <Stack.Screen name='(auth)' options={{title: 'Authentication'}}/>
        <Stack.Screen name='(tabs)' options={{title: 'App'}}/>
        <Stack.Screen name='(admin)' options={{title: 'Admin'}}/>
        <Stack.Screen name='(tow)' options={{title: 'Tow Console'}}/>
      </Stack>
    </>
  );
}

export default RootLayout;