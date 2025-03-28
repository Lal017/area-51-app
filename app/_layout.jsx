import { Amplify } from "aws-amplify";
import awsconfig from "../src/amplifyconfiguration.json";
import { Stack } from "expo-router";
import { initializePushNotifications } from "aws-amplify/push-notifications";

Amplify.configure(awsconfig);
initializePushNotifications();

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