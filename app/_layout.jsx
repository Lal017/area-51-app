import { Amplify } from "aws-amplify";
import awsconfig from "../src/amplifyconfiguration.json";
import { Authenticator, useAuthenticator} from "@aws-amplify/ui-react-native";
import { Stack } from "expo-router";
import { useEffect } from "react";

Amplify.configure(awsconfig);

export default function RootLayout() {
  
  return (
      <Authenticator.Provider>
        <AuthStateLogger />
        <Authenticator>
          <AppContent/>
        </Authenticator>
      </Authenticator.Provider>
  );
}

function AuthStateLogger() {
  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
    context.user
  ]);

  useEffect(() => {
    console.log('Current auth status:', authStatus);
    if (authStatus === 'authenticated') {
      console.log('Authenticated user:', user);
    }
  }, [authStatus, user]);

  return null; // This component doesn't render anything
}

// App Stack
const AppContent = () =>
{
  const { user } = useAuthenticator((context) => [context.user]);
  console.log(user);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
  );
};
