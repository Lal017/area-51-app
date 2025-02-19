import { View, Button } from "react-native";
import Styles from "./styles";
import { useAuthenticator } from "@aws-amplify/ui-react";

const SignOutButton = () =>
{
    const { signOut } = useAuthenticator();
    
    return (
        <View style={Styles.signOut}>
            <Button title="Sign Out" onPress={signOut}/>
        </View>
    );
};

export default SignOutButton;