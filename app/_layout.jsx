import { Amplify } from 'aws-amplify';
// import Constants from "expo-constants";
import amplifyconfig from '../src/amplifyconfiguration.json';
import { Stack } from "expo-router";
import { setNotificationHandler } from "expo-notifications";

// const amplifyConfig = Constants.expoConfig?.extra?.amplifyConfig;

Amplify.configure(amplifyconfig);

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
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