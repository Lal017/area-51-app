import Colors from "../../../constants/colors";
import { ProfileStyles, Styles } from "../../../constants/styles";
import { Background, Tab } from "../../../components/components";
import { useApp } from "../../../components/context";
import { View, Text } from "react-native";
import Animated, { Easing , useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { AntDesign, FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { router } from "expo-router";

// Profile page
const Profile = () =>
{
    const { email, firstName, lastName, newInvoice, setNewInvoice, newEstimate, setNewEstimate, vehiclePickup } = useApp();

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
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <Text style={ProfileStyles.name}>{firstName} {lastName}</Text>
                    <Text style={[Styles.text, {fontSize: 17}]}>{email}</Text>
                </View>
            </View>
            <Tab
                text="Account Settings"
                action={() => router.push('/settings')}
                leftIcon={<Ionicons name="settings" size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <View style={ProfileStyles.tabContainer}>
                { vehiclePickup ? (
                    <Animated.View style={[ProfileStyles.activityContainer, animatedStyle, {backgroundColor: Colors.tertiary}]}>
                        <Text style={[Styles.subTitle, {fontSize: 20, textAlign: 'center'}]}>!</Text>
                    </Animated.View>
                ) : null }
                <Tab
                    text="My Vehicles"
                    action={() => router.push('/vehicleList')}
                    leftIcon={<Ionicons name="car-sport" size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
                />
            </View>
            <View style={ProfileStyles.tabContainer}>
                { newInvoice ? (
                    <Animated.View style={[ProfileStyles.activityContainer, animatedStyle, {backgroundColor: Colors.tertiary}]}>
                        <Text style={[Styles.subTitle, {fontSize: 20, textAlign: 'center'}]}>!</Text>
                    </Animated.View>
                ) : null }
                <Tab
                    text="Invoices"
                    action={() => {
                        router.push({
                            pathname: '/invoices',
                            params: { isInvoice: true }
                        });
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
                        router.push({
                            pathname: '/estimates'
                        });
                        setNewEstimate(false);
                    }}
                    leftIcon={<FontAwesome6 name="file-circle-question" size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
                />
            </View>
            <Tab
                text="Contact us"
                action={() => router.push('/contact')}
                leftIcon={<MaterialIcons name="contact-support" size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
        </Background>
    );
};

export default Profile;