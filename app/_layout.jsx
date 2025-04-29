import { Amplify } from 'aws-amplify';
import Constants from 'expo-constants';
import amplifyconfig from '../src/amplifyconfiguration.json';
import { Stack } from 'expo-router';
import { setNotificationHandler } from 'expo-notifications';

if (Constants.expoConfig.extra.amplifyConfig === null){
  Amplify.configure(Constants.expoConfig.extra.amplifyConfig);
} else {
  Amplify.configure(amplifyconfig);
}

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
    </Stack>
  );
}

export default RootLayout;