import { TouchableOpacity, Text } from "react-native";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Styles from "../constants/styles";

const SignOutButton = () =>
{
    const { signOut } = useAuthenticator();
    
    return(
        <TouchableOpacity
            style={Styles.button}
            onPress={signOut}>
            <Text style={{color: 'white', textAlign: 'center'}}>Sign Out</Text>
        </TouchableOpacity>
   
    )
};

export default SignOutButton;