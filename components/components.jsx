import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { signOut } from '@aws-amplify/auth';
import { getPermissionStatus, requestPermissions} from '@aws-amplify/rtn-push-notification';
import Styles from '../constants/styles';
import { Auth } from 'aws-amplify';

// permission to send push notifications
const handlePermissions = async () =>
{
    const status = await getPermissionStatus();
    if (status === 'granted') { return; }
    if (status === 'denied') { return; }
    if (status === 'shouldRequest') { await requestPermissions(); }
    if (status === 'shouldExplainThenRequest')
    {
        await permissionRequestExplanation();
        await requestPermissions();
    }
};

// get token and store in cognito for user
const handleTokenReceived = async (token, user) =>
{
    try {
        if(!user) {
            console.log('No user found in context');
            return;
        }

        const userId = user.id || user.userId || user.username;
        console.log(`saving token for user ${userId}: ${token}`);

        await Auth.updateUserAttributes(user, {
            deviceToken: token
        });
        console.log('token saved successfully');
    } catch (error) {
        console.log('error saving token: ', error);
    }
};

// explanation to user for permission request
const permissionRequestExplanation = async () =>
{
    Alert.alert(
        'Allow Push Notifications',
        'Note: this app requires push notifications to be enabled.',
    );
};

// custom header component to replace default header
const CustHeader = () =>
{
    return(
        <View style={Styles.HeaderContainer}>
            <Image
                source={require('../assets/images/icon.png')}
                style={Styles.LogoImg} />
        </View>
    );
};

// Sign out button component
const SignOutButton = () =>
{    
    const { signOut, toSignIn } = useAuthenticator((context) => [context.signOut, context.route]);
    // delete user info and sign out of app
    const handleSignOut = async () =>
    {
        try {
            // sign out from amplify
            signOut({global: true});
            toSignIn();
            console.log('signed out successfully');
        } catch (error) {
            console.log('error signing out: ', error);
        }
    };

    return(
        <TouchableOpacity
            style={Styles.OutButton}
            onPress={handleSignOut}>
            <Text style={Styles.OutText}>Sign Out</Text>
        </TouchableOpacity>
    )
};

// reusable tab component for settings section
const SettingsTab = ({text, action}) =>
{
    return(
        <View style={Styles.SettingsTab}>
            <TouchableOpacity
                style={Styles.SettingsTabButton}
                onPress={action}
            >
                <Text style={Styles.SettingsTabText}>{text}</Text>            
            </TouchableOpacity>
        </View>
    )
};

//redirects to the trop locksmith website
const websiteRedirect = () =>
{
    Linking.openURL('https://troplocksmithlasvegas.com/');
}

export { SignOutButton };
export { CustHeader };
export { SettingsTab };
export { websiteRedirect };
export { handlePermissions };
export { handleTokenReceived };