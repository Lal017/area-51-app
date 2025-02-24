import { Amplify } from "aws-amplify";
import awsconfig from "../src/amplifyconfiguration.json";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import { Stack } from "expo-router";
import { fetchUserAttributes } from "aws-amplify/auth";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

Amplify.configure(awsconfig);

// App Stack
function AppContent() {
  const { user, authStatus } = useAuthenticator();
  const { setUserInfo } = useUser();

  // If user is authenticated and exits, get user data
  // Called when authStatus or user changes
  useEffect(() => {
    const getUserData = async () => {
      if (authStatus === 'authenticated' && user) {
        try {
          const userData = await fetchUserAttributes();
          setUserInfo(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    getUserData();
  }, [authStatus, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
  );
}

export default function RootLayout() {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      <Authenticator.Provider>
        <Authenticator>
          <AppContent />
        </Authenticator>
      </Authenticator.Provider>
    </UserContext.Provider>
  );
}
