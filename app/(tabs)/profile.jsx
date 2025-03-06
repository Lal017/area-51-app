import { View, Text, TouchableOpacity } from "react-native";
import { Styles, AuthStyles } from "../../constants/styles";
import { SettingsTab, websiteRedirect } from "../../components/components";
import { handleSignOut } from "../../components/authComponents";

// Profile page
const Profile = () =>
{
    return(
        <View style={Styles.ProfilePage}>
            <View style={Styles.ProfileCard}>
            </View>
            <View style={Styles.TabContainer}>
                <SettingsTab text="Account Settings" />
                <SettingsTab text="Contact us" />
                <SettingsTab text="Website" action={websiteRedirect}/>
            </View>
            <TouchableOpacity
                onPress={() => handleSignOut()}
                style={AuthStyles.actionButton}
            >
                <Text style={{color: 'white', textAlign: 'center'}}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Profile;