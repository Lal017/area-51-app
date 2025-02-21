import { Amplify } from "aws-amplify";
import awsconfig from "../src/amplifyconfiguration.json";
import { Authenticator } from "@aws-amplify/ui-react-native";
import { Stack } from "expo-router";

Amplify.configure(awsconfig);

export default function RootLayout() {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <Stack screenOptions={{ headerShown: false }} />
      </Authenticator>
    </Authenticator.Provider>
  );
}
