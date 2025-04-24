import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { Styles, ProfileStyles } from '../constants/styles';

// custom header component to replace default header
const CustHeader = () =>
{
    return(
        <View style={Styles.HeaderContainer}>
            <Image
                source={require('../assets/images/a51-title-logo.png')}
                style={Styles.LogoImg}
            />
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
const socialRedirect = () =>
{
    Linking.openURL('https://www.instagram.com/area51motorsports/');
};

export {
    CustHeader,
    SettingsTab,
    socialRedirect,
};