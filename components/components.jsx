import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Styles, ProfileStyles } from '../constants/styles';
import Colors from '../constants/colors';

// custom header component to replace default header
const CustHeader = ({title}) =>
{
    return (
        <View style={Styles.HeaderContainer}>
            <Text style={Styles.HeaderTitle}>{title}</Text>
        </View>
   
    );
};

// reusable tab component for tabs
const Tab = ({text, action}) =>
{
    return(
        <View style={Styles.tab}>
            <TouchableOpacity
                style={Styles.tabButton}
                onPress={action}
            >
                <Text>{text}</Text>            
            </TouchableOpacity>
        </View>
    )
};

// reusable tab component for Selections
const Select = ({text, selected, action}) =>
{
    return(
        <View style={Styles.tab}>
            <TouchableOpacity
                style={[Styles.tabButton, selected ? {backgroundColor: Colors.secondary} : null]}
                onPress={action}
            >
                <Text style={selected ? {color: Colors.text} : null}>{text}</Text>            
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
    Tab,
    Select,
    socialRedirect,
};