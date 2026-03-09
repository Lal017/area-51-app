import { ProfileStyles, Styles } from '../../constants/styles'
import { Background, Tab, formatNumber } from '../../components/components';
import { useApp } from '../../components/context';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const Settings = () =>
{
    const { email, firstName, lastName, phoneNumber, access } = useApp();

    const readableNumber = phoneNumber ? formatNumber(phoneNumber) : null;

    return(
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={ProfileStyles.name}>{firstName} {lastName}</Text>
                    <Text style={Styles.tabHeader}>{email}</Text>
                    <Text style={Styles.tabHeader}>{readableNumber}</Text>
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
            { access === "Customers" ? (
                <Tab
                    text="Tow Driver Account"
                    action={() => router.push('driverAccountRequest')}
                    leftIcon={<MaterialCommunityIcons name='tow-truck' size={30} style={Styles.icon}/>}
                    rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon}/>}
                />
            ) : null}
            <Tab
                text="Delete Account"
                action={() => router.push('deleteAccount')}
                leftIcon={<AntDesign name='delete' size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
        </Background>
    );
};

export default Settings;