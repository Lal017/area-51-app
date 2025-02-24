import { View, Image, Text } from "react-native";
import Styles from "../../constants/styles"
import { SettingsTab } from "../../components/components";
import { useUser } from "../_layout";
import { useAuthenticator } from "@aws-amplify/ui-react-native";

// Profile page
const Profile = () =>
{
    const { userInfo } = useUser();                 // User information from context
    const { authStatus } = useAuthenticator();      // Check if user is authenticated hook

    return(
        <View style={Styles.ProfilePage}>
            <View style={Styles.ProfileCard}>
                <Text>Image will go here</Text>
                {authStatus === 'authenticated' ? (
                    userInfo ? (
                        <>
                            <Text>{userInfo.name}</Text>
                            <Text>{userInfo.email}</Text>
                        </>
                    ) : (
                    <Text>Loading user data...</Text>
                    )
                ) : (
                    <Text>Please sign in to view profile</Text>
                )}
            </View>
            <SettingsTab text="Settings" />
        </View>
    );
};

export default Profile;