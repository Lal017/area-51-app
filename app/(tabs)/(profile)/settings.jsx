import { View, Text } from 'react-native';
import { ProfileStyles, Styles } from '../../../constants/styles'
import { Tab, formatNumber } from '../../../components/components';
import { router } from 'expo-router';
import { useApp } from '../../../components/context';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

const Settings = () =>
{
    const { email, name, phoneNumber } = useApp();

    const readableNumber = phoneNumber ? formatNumber(phoneNumber) : null;

    return(
        <View style={Styles.page}>
            <View style={[Styles.infoContainer, {paddingTop: 10, paddingBottom: 30}]}>
                <Text style={ProfileStyles.name}>{name}</Text>
                <Text style={Styles.text}>{email}</Text>
                <Text style={Styles.text}>{readableNumber}</Text>
            </View>
            <Tab
                text="Edit Profile"
                action={() => router.push('/(tabs)/(profile)/accountEdit')}
                leftIcon={<Ionicons name='person' size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <Tab
                text="Change password"
                action={() => router.push('/(tabs)/(profile)/changePassword')}
                leftIcon={<MaterialIcons name='lock-reset' size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <Tab
                text="Delete Account"
                action={() => router.push('/(tabs)/(profile)/deleteAccount')}
                leftIcon={<AntDesign name='deleteuser' size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
        </View>
    );
};

export default Settings;