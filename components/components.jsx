import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Styles, ProfileStyles } from '../constants/styles';

// custom header component to replace default header
const CustHeader = ({title}) =>
{
    return (
        <View style={Styles.HeaderContainer}>
            <Text style={Styles.HeaderTitle}>{title}</Text>
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
const socialRedirect = (link) =>
{
    Linking.openURL(link);
};

export {
    CustHeader,
    SettingsTab,
    socialRedirect,
};