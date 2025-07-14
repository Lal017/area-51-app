import { View, Text } from 'react-native';
import { ProfileStyles, Styles } from '../../../constants/styles'
import { Background, Tab, formatNumber } from '../../../components/components';
import { router } from 'expo-router';
import { useApp } from '../../../components/context';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

const Settings = () =>
{
    const { email, firstName, lastName, phoneNumber } = useApp();

    const readableNumber = phoneNumber ? formatNumber(phoneNumber) : null;

    return(
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={ProfileStyles.name}>{firstName} {lastName}</Text>
                    <Text style={Styles.text}>{email}</Text>
                    <Text style={Styles.text}>{readableNumber}</Text>
                </View>
            </View>
            <Tab
                text="Edit Profile"
                action={() => router.push('accountEdit')}
                leftIcon={<Ionicons name='person' size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <Tab
                text="Change password"
                action={() => router.push('resetPassword')}
                leftIcon={<MaterialIcons name='lock-reset' size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <Tab
                text="Delete Account"
                action={() => router.push('deleteAccount')}
                leftIcon={<AntDesign name='deleteuser' size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
        </Background>
    );
};

export default Settings;