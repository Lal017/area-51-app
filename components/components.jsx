import { View, Text, Image, TouchableOpacity } from "react-native";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Styles from "../constants/styles";
import { useUser } from "../app/_layout";

// Sign out button component
const SignOutButton = () =>
{
    const { setUserInfo } = useUser();
    const { signOut } = useAuthenticator();
    
    // delete user info and sign out of app
    const handleSignOut = () =>
    {
        setUserInfo(null);
        signOut();
    };

    return(
        <TouchableOpacity
            style={Styles.OutButton}
            onPress={handleSignOut}>
            <Text style={{color: 'black', textAlign: 'center'}}>Sign Out</Text>
        </TouchableOpacity>
   
    )
};

const CustHeader = () =>
{
    return(
        <View style={Styles.HeaderContainer}>
            <Image
                source={require('../assets/images/icon.png')}
                style={{width: 100, height: 100, marginLeft: 20}} />
        </View>
    );
};

const SettingsTab = ({text}) =>
{
    return(
        <View style={Styles.SettingsTab}>
            <TouchableOpacity style={Styles.SettingsTabButton}>
                <Text style={{color: 'white', textAlign: 'center'}}>{text}</Text>            
            </TouchableOpacity>
        </View>
    )
};

export default SignOutButton;
export { CustHeader };
export { SettingsTab };