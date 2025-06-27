import { View, Text, TouchableOpacity, Linking } from "react-native";
import { useState, useEffect } from "react";
import Animated, { Easing , useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { ProfileStyles, Styles } from "../../../constants/styles";
import Colors from "../../../constants/colors";
import { Background, Tab } from "../../../components/components";
import { handleSignOut } from "../../../components/authComponents";
import { router } from "expo-router";
import { useApp } from "../../../components/context";
import { AntDesign, FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Profile page
const Profile = () =>
{
    const { email, firstName, lastName, newInvoice, setNewInvoice, newEstimate, setNewEstimate } = useApp();
    const [ loading, setLoading ] = useState(false);

    const bounce = useSharedValue(0);

    useEffect(() => {
        bounce.value = withRepeat(
            withSequence(
            withTiming(-10, {
                duration: 500,
                easing: Easing.out(Easing.ease)
            }),
            withTiming(0, {
                duration: 500,
                easing: Easing.in(Easing.ease)
            })
            ),
            -1,     // infinite
            true,   // reverse
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }]
    }));

    return(
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={ProfileStyles.name}>{firstName} {lastName}</Text>
                    <Text style={[Styles.text, {fontSize: 17}]}>{email}</Text>
                </View>
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
            <View style={ProfileStyles.tabContainer}>
                { newInvoice ? (
                    <Animated.View style={[ProfileStyles.activityContainer, animatedStyle, {backgroundColor: Colors.tertiary}]}>
                        <Text style={[Styles.subTitle, {fontSize: 20, textAlign: 'center'}]}>!</Text>
                    </Animated.View>
                ) : null }
                <Tab
                    text="Invoices"
                    action={() => {
                        router.push('/(tabs)/(profile)/invoices');
                        setNewInvoice(false);
                    }}
                    leftIcon={<FontAwesome6 name="file-invoice-dollar" size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
                />
            </View>
            <View style={ProfileStyles.tabContainer}>
                { newEstimate ? (
                    <Animated.View style={[ProfileStyles.activityContainer, animatedStyle, {backgroundColor: Colors.tertiary}]}>
                        <Text style={[Styles.subTitle, {fontSize: 20, textAlign: 'center'}]}>!</Text>
                    </Animated.View>
                ) : null }
                <Tab
                    text="Estimates"
                    action={() => {
                        router.push('/(tabs)/(profile)/estimates');
                        setNewEstimate(false);
                    }}
                    leftIcon={<FontAwesome6 name="file-circle-question" size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
                />
            </View>
            <Tab
                text="Contact us"
                action={() => router.push('/(tabs)/(profile)/contact')}
                leftIcon={<MaterialIcons name="contact-support" size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <View style={ProfileStyles.socialContainer}>
                <TouchableOpacity
                    style={[ProfileStyles.socialBox, {backgroundColor: '#1877f2'}]}
                    onPress={() => Linking.openURL('https://www.facebook.com/Area51MotorsportsLv/')}
                >
                    <AntDesign name="facebook-square" size={30} color='white' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => Linking.openURL('https://www.instagram.com/area51motorsports/')}
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
                onPress={async () => {
                    if (loading) return;
                    setLoading(true);
                    await handleSignOut();
                    setLoading(false);
                }}
                style={[Styles.actionButton, loading && { opacity: 0.5 }]}
                disabled={loading}
            >
                <Text style={Styles.actionText}>Sign Out</Text>
            </TouchableOpacity>
        </Background>
    );
};

export default Profile;