import { View, Text, TouchableOpacity } from "react-native";
import { ProfileStyles, Styles } from "../../constants/styles";
import { Tab, socialRedirect } from "../../components/components";
import { handleSignOut } from "../../components/authComponents";
import { router } from "expo-router";
import { useApp } from "../../components/context";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";

// Profile page
const Profile = () =>
{
    const { email, name } = useApp();

    return(
        <View style={[Styles.page, {justifyContent: 'flex-start'}]}>
            <View style={ProfileStyles.accountCard}>
                <View style={ProfileStyles.accountText}>
                    <Text style={ProfileStyles.name}>{name}</Text>
                    <Text>{email}</Text>
                </View>
            </View>
            <View style={Styles.tabContainer}>
            <View style={Styles.tabWrapper}>
                    <Ionicons name='person' size={30} style={Styles.icon} />
                    <Tab text="Edit Profile" action={() => router.push('/(admin)/accountEdit')} />
                    <AntDesign name="right" size={25} style={Styles.rightIcon} />
                </View>
                <View style={Styles.tabWrapper}>
                    <MaterialIcons name='lock-reset' size={30} style={Styles.icon} />
                    <Tab text="Change password" action={() => router.push('/(admin)/changePassword')} />
                    <AntDesign name="right" size={25} style={Styles.rightIcon} />
                </View>
                <View style={Styles.tabWrapper}>
                    <AntDesign name='deleteuser' size={30} style={Styles.icon} />
                    <Tab text="Delete Account" action={() => router.push('/(admin)/deleteAccount')} />
                    <AntDesign name="right" size={25} style={Styles.rightIcon} />
                </View>
                <View style={ProfileStyles.socialContainer}>
                    <TouchableOpacity
                        style={[ProfileStyles.socialBox, {backgroundColor: '#1877f2'}]}
                        onPress={() => socialRedirect('https://www.facebook.com/Area51MotorsportsLv/')}
                    >
                        <AntDesign name="facebook-square" size={30} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[ProfileStyles.socialBox, {backgroundColor: 'black'}]}
                        onPress={() => socialRedirect('https://www.instagram.com/area51motorsports/')}
                    >
                        <AntDesign name="instagram" size={30} color='white' />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                onPress={handleSignOut}
                style={Styles.actionButton}
            >
                <Text style={Styles.actionText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Profile;