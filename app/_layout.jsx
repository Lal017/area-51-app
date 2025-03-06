import { Amplify } from "aws-amplify";
import awsconfig from "../src/amplifyconfiguration.json";
import { Stack } from "expo-router";

Amplify.configure(awsconfig);

const RootLayout = () =>
{
  return <Stack screenOptions={{headerShown: false}}/>;
}

export default RootLayout;