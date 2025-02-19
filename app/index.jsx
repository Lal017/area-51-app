import { Amplify } from "aws-amplify";
import awsconfig from '../src/amplifyconfiguration.json';
Amplify.configure(awsconfig);
import { Authenticator } from "@aws-amplify/ui-react-native";
import SignOutButton from "./components";

const Index = () =>
{
  return (
    <Authenticator.Provider>
      <Authenticator>
        <SignOutButton />
      </Authenticator>
    </Authenticator.Provider>
  );
}

export default Index;