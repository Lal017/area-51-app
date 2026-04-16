import Colors from "../../../constants/colors";
import MaskedView from "@react-native-masked-view/masked-view";
import { ProfileStyles, Styles } from "../../../constants/styles";
import { Background, Tab } from "../../../components/components";
import { useApp } from "../../../hooks/useApp";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import { AntDesign, FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import useShimmer from "../../../hooks/useShimmer";

// Profile page
const Profile = () =>
{
    const { email, firstName, lastName, newInvoice, setNewInvoice, newEstimate, setNewEstimate, vehiclePickup } = useApp();

    const shimmerStyle = useShimmer();

    return(
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={ProfileStyles.name}>{firstName} {lastName}</Text>
                    <Text style={Styles.tabHeader}>{email}</Text>
                </View>
            </View>
            <Tab
                text="Account Settings"
                action={() => router.push('/settings')}
                leftIcon={<Ionicons name="settings" size={30} style={Styles.icon} />}
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <Tab
                text="My Vehicles"
                action={() => router.push('/vehicleList')}
                leftIcon={
                    <MaskedView
                        style={[Styles.icon, {width: 30, height: 30}]}
                        maskElement={
                            <Ionicons
                                name='car-sport'
                                size={30}
                            />
                        }
                    >
                        <View style={[{flex: 1}, vehiclePickup?.length > 0 ? {backgroundColor: Colors.tertiary} : {backgroundColor: Colors.accent}]}/>
                        { vehiclePickup?.length > 0 && (
                            <Animated.View
                                style={[shimmerStyle, {
                                position: 'absolute',
                                top: 0, bottom: 0,
                                width: '100%'
                                }]}
                            >
                                <LinearGradient
                                colors={[Colors.tertiary, Colors.accent, Colors.tertiary]}
                                style={{flex: 1}}
                                start={{ x: 0, y: 0}}
                                end={{ x: 1, y: 1}}
                                />
                            </Animated.View>
                        )}
                    </MaskedView>
                }
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <Tab
                text="Invoices"
                action={() => {
                    router.push({
                        pathname: '/invoices',
                        params: { isInvoice: true }
                    });
                    setNewInvoice(false);
                }}
                leftIcon={
                    <MaskedView
                        style={[Styles.icon, {width: 30, height: 30}]}
                        maskElement={
                            <FontAwesome6
                                name="file-invoice-dollar"
                                size={30}
                            />
                        }
                    >
                        <View style={[{flex: 1}, newInvoice ? {backgroundColor: Colors.tertiary} : {backgroundColor: Colors.accent}]}/>
                        { newInvoice && (
                            <Animated.View
                                style={[shimmerStyle, {
                                position: 'absolute',
                                top: 0, bottom: 0,
                                width: '100%'
                                }]}
                            >
                                <LinearGradient
                                colors={[Colors.tertiary, Colors.accent, Colors.tertiary]}
                                style={{flex: 1}}
                                start={{ x: 0, y: 0}}
                                end={{ x: 1, y: 1}}
                                />
                            </Animated.View>
                        )}
                    </MaskedView>
                }
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
            <Tab
                text="Estimates"
                action={() => {
                    router.push({
                        pathname: '/estimates'
                    });
                    setNewEstimate(false);
                }}
                leftIcon={
                    <MaskedView
                        style={[Styles.icon, {width: 35, height: 35}]}
                        maskElement={
                            <FontAwesome6
                                name="file-circle-question"
                                size={30}
                            />
                        }
                    >
                        <View style={[{flex: 1}, newEstimate ? {backgroundColor: Colors.tertiary} : {backgroundColor: Colors.accent}]}/>
                        { newEstimate && (
                            <Animated.View
                                style={[shimmerStyle, {
                                position: 'absolute',
                                top: 0, bottom: 0,
                                width: '100%'
                                }]}
                            >
                                <LinearGradient
                                colors={[Colors.tertiary, Colors.accent, Colors.tertiary]}
                                style={{flex: 1}}
                                start={{ x: 0, y: 0}}
                                end={{ x: 1, y: 1}}
                                />
                            </Animated.View>
                        )}
                    </MaskedView>
                }
                rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}
            />
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