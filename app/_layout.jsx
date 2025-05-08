import { Amplify } from 'aws-amplify';
import Constants from 'expo-constants';
import amplifyconfig from '../src/amplifyconfiguration.json';

try {
  if (Constants.expoConfig.extra.amplifyConfig){
    Amplify.configure(Constants.expoConfig.extra.amplifyConfig);
  } else {
    Amplify.configure(amplifyconfig);
  }
  console.log('AMPLIFY CONFIGURED SUCCESSFULLY');
} catch (error) {
  console.error('ERROR CONFIGURING AMPLIFY', error);
}

import { Stack } from 'expo-router';
import { setNotificationHandler } from 'expo-notifications';

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
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name='index' options={{title: 'Home'}}/>
      <Stack.Screen name='(auth)' options={{title: 'Authentication'}}/>
      <Stack.Screen name='(tabs)' options={{title: 'App'}}/>
      <Stack.Screen name='(admin)' options={{title: 'Admin'}}/>
    </Stack>
  );
}

export default RootLayout;