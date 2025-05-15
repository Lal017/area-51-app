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
        <View style={[Styles.page, {justifyContent: 'flex-start'}]}>
            <View style={ProfileStyles.accountCard}>
                <View style={ProfileStyles.accountInfo}>
                    <Text style={ProfileStyles.name}>{name}</Text>
                    <Text style={ProfileStyles.subTitle}>{email}</Text>
                    <Text style={ProfileStyles.subTitle}>{readableNumber}</Text>
                </View>
            </View>
            <View style={Styles.tabContainer}>
                <View style={Styles.tabWrapper}>
                    <Ionicons name='person' size={30} style={Styles.icon} />
                    <Tab text="Edit Profile" action={() => router.push('/(tabs)/(profile)/accountEdit')} />
                    <AntDesign name="right" size={25} style={Styles.rightIcon} />
                </View>
                <View style={Styles.tabWrapper}>
                    <MaterialIcons name='lock-reset' size={30} style={Styles.icon} />
                    <Tab text="Change password" action={() => router.push('/(tabs)/(profile)/changePassword')} />
                    <AntDesign name="right" size={25} style={Styles.rightIcon} />
                </View>
                <View style={Styles.tabWrapper}>
                    <AntDesign name='deleteuser' size={30} style={Styles.icon} />
                    <Tab text="Delete Account" action={() => router.push('/(tabs)/(profile)/deleteAccount')} />
                    <AntDesign name="right" size={25} style={Styles.rightIcon} />
                </View>
            </View>
        </View>
    );
};

export default Settings;