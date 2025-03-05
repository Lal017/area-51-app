import { View } from "react-native";
import Styles from "../../constants/styles"
import { SignOutButton, SettingsTab, websiteRedirect } from "../../components/components";

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
            <SignOutButton />
        </View>
    );
};

export default Profile;