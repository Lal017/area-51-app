import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { getPermissionStatus, requestPermissions} from '@aws-amplify/rtn-push-notification';
import { Styles, ProfileStyles } from '../constants/styles';

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

// reusable tab component for settings section
const SettingsTab = ({text, action}) =>
{
    return(
        <View style={ProfileStyles.tab}>
            <TouchableOpacity
                style={ProfileStyles.tabButton}
                onPress={action}
            >
                <Text style={ProfileStyles.tabText}>{text}</Text>            
            </TouchableOpacity>
        </View>
    )
};

//redirects to the trop locksmith website
const websiteRedirect = () =>
{
    Linking.openURL('https://troplocksmithlasvegas.com/');
};

export {
    CustHeader,
    SettingsTab,
    websiteRedirect,
    handlePermissions,
};