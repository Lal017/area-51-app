import { View, Text } from 'react-native';
import { ProfileStyles } from '../../../constants/styles'
import { SettingsTab } from '../../../components/components';
import { router } from 'expo-router';
import { useApp } from '../../../components/context';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

const Settings = () =>
{
    const { email, name, phoneNumber } = useApp();

    const formatNumber = (phone) =>
    {
        const clean = phone.replace(/\D/g, '').slice(-10);
        const match = clean.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return `(${match[1]}) ${match[2]} - ${match[3]}`;
        }
        return phone;
    };

    const readableNumber = formatNumber(phoneNumber);

    return(
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.accountCard}>
                <View style={ProfileStyles.accountInfo}>
                    <Text style={ProfileStyles.name}>{name}</Text>
                    <Text style={ProfileStyles.subTitle}>{email}</Text>
                    <Text style={ProfileStyles.subTitle}>{readableNumber}</Text>
                </View>
            </View>
            <View style={ProfileStyles.tabContainer}>
                <View style={ProfileStyles.tabWrapper}>
                    <Ionicons name='person' size={30} style={ProfileStyles.icon} />
                    <SettingsTab text="Edit Profile" action={() => router.push('accountEdit')} />
                    <AntDesign name="right" size={25} style={ProfileStyles.arrowIcon} />
                </View>
                <View style={ProfileStyles.tabWrapper}>
                    <MaterialIcons name='lock-reset' size={30} style={ProfileStyles.icon} />
                    <SettingsTab text="Change password" action={() => router.push('changePassword')} />
                    <AntDesign name="right" size={25} style={ProfileStyles.arrowIcon} />
                </View>
                <View style={ProfileStyles.tabWrapper}>
                    <AntDesign name='deleteuser' size={30} style={ProfileStyles.icon} />
                    <SettingsTab text="Delete Account" action={() => router.push('deleteAccount')} />
                    <AntDesign name="right" size={25} style={ProfileStyles.arrowIcon} />
                </View>
            </View>
        </View>
    );
};

export default Settings;