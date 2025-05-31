import { View, Text, TouchableOpacity } from "react-native";
import { ProfileStyles, Styles } from "../../../constants/styles";
import { Tab, socialRedirect } from "../../../components/components";
import { handleSignOut } from "../../../components/authComponents";
import { router } from "expo-router";
import { useApp } from "../../../components/context";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Profile page
const Profile = () =>
{
    const { email, name } = useApp();

    return(
        <View style={Styles.page}>
            <View style={[Styles.infoContainer, {paddingTop: 10, paddingBottom: 30}]}>
                <Text style={ProfileStyles.name}>{name}</Text>
                <Text style={[Styles.text, {fontSize: 17}]}>{email}</Text>
            </View>
            <Tab
                text="Account Settings"
                action={() => router.push('/(tabs)/(profile)/settings')}
                leftIcon={<Ionicons name="settings" size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <Tab
                text="My Vehicles"
                action={() => router.push('/(tabs)/(profile)/vehicleList')}
                leftIcon={<Ionicons name="car-sport" size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <Tab
                text="Contact us"
                action={() => router.push('/(tabs)/(profile)/contact')}
                leftIcon={<MaterialIcons name="contact-support" size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <View style={ProfileStyles.socialContainer}>
                <TouchableOpacity
                    style={[ProfileStyles.socialBox, {backgroundColor: '#1877f2'}]}
                    onPress={() => socialRedirect('https://www.facebook.com/Area51MotorsportsLv/')}
                >
                    <AntDesign name="facebook-square" size={30} color='white' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => socialRedirect('https://www.instagram.com/area51motorsports/')}
                >
                    <LinearGradient
                        colors={['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5']}
                        style={ProfileStyles.socialBox}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <AntDesign name="instagram" size={30} color='white' />
                    </LinearGradient>
                </TouchableOpacity>
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