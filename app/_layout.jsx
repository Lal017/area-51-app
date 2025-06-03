import { Amplify } from 'aws-amplify';
import amplifyconfig from '../src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

import { Stack } from 'expo-router';
import { setNotificationHandler } from 'expo-notifications';
import { Hub } from 'aws-amplify/utils';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { handleGetCurrentUser } from '../components/authComponents';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

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
  const [ fontsLoaded ] = useFonts({
    'Roboto-Condensed-Light': require('../assets/fonts/Roboto_Condensed-Light.ttf'),
    'Roboto-SemiCondensed-Bold': require('../assets/fonts/Roboto_SemiCondensed-Bold.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
  });

  useEffect(() => {
    const listener = Hub.listen('auth', async (data) => {
      const { payload } = data;
      
      // Handle authentication events
      switch (payload.event) {
        case 'signedIn':
          // Redirect to home screen or dashboard after successful sign in
          const user = await handleGetCurrentUser();
          const isAdmin = user?.accessToken?.payload["cognito:groups"]?.includes('Admins');
          if (router.canDismiss()) { router.dismissAll(); }
          if (isAdmin) { router.replace('(admin)'); }
          else { router.replace('(tabs)'); }
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
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='index' options={{title: 'Home'}}/>
        <Stack.Screen name='(auth)' options={{title: 'Authentication'}}/>
        <Stack.Screen name='(tabs)' options={{title: 'App'}}/>
        <Stack.Screen name='(admin)' options={{title: 'Admin'}}/>
      </Stack>
    </>
  );
}

export default RootLayout;