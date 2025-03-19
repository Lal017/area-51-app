import { View, Text, TouchableOpacity } from "react-native";
import { ProfileStyles } from "../../../constants/styles";
import { SettingsTab, websiteRedirect } from "../../../components/components";
import { handleSignOut } from "../../../components/authComponents";
import { router } from "expo-router";

// Profile page
const Profile = () =>
{
    return(
        <View style={ProfileStyles.page}>
            <View style={ProfileStyles.accountCard}>
            </View>
            <View style={ProfileStyles.tabContainer}>
                <SettingsTab text="Account Settings" action={() => router.push('settings')}/>
                <SettingsTab text="Contact us" action={() => router.push('contact')}/>
                <SettingsTab text="Website" action={websiteRedirect}/>
            </View>
            <TouchableOpacity
                onPress={() => handleSignOut()}
                style={ProfileStyles.actionButton}
            >
                <Text style={{color: 'white', textAlign: 'center'}}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Profile;