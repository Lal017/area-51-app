import { View } from "react-native";
import { useEffect } from "react";
import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchUserAttributes, getCurrentUser } from "@aws-amplify/auth";
import { CustHeader } from "../../components/components";
import { handlePermissions, notificationRecievedHandler, notificationOpenedHandler } from "../../components/notifComponents";
import { Styles } from "../../constants/styles";
import Colors from "../../constants/colors";
import {
    identifyUser,
    onNotificationReceivedInBackground,
    onNotificationReceivedInForeground,
    onNotificationOpened
} from "aws-amplify/push-notifications";

const TabsLayout = () =>
{
    const segments = useSegments();
    
    useEffect(() => {
    if (segments[0] === '(tabs)') {
        const initPermissions = async () => {
            try {
                await handlePermissions();
            } catch (error) {
                console.log(error);
            }
        };
    
        initPermissions();
    }
    }, [segments]);

    useEffect(() => {
        const handleIdentifyUser = async () =>
        {
            const { userId } = await getCurrentUser();
            const user = await fetchUserAttributes();

            try {
                await identifyUser({
                    userId: userId,
                    userProfile: {
                        email: user.email,
                        name: user.name,
                    },
                });
                console.log("success");
            } catch (error) {
                console.log(error);
            }
        };

        handleIdentifyUser();
        const foregroundListener = onNotificationReceivedInForeground(
            notificationRecievedHandler
        );
        const backgroundListener = onNotificationReceivedInBackground(
            notificationRecievedHandler
        );
        const openedListener = onNotificationOpened(notificationOpenedHandler);

        return () => { foregroundListener.remove(); openedListener.remove(); };
    }, []);

    return (
        <Tabs
            screenOptions={{
                header: () => <CustHeader/>,
                tabBarStyle: Styles.tabBarStyle,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.secondary,
                tabBarIconStyle: Styles.tabBarIconStyle,
                tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                title: 'Home',
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color}/>
                ),
                }}
            />
            <Tabs.Screen
                name="request"
                options={{
                    title: "Request a locksmith",
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={Styles.KeyIconContainer}>
                            <Ionicons
                                name="key"
                                size={size} 
                                color={focused ? color: "white"} 
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                title: "Profile",
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" size={size} color={color}/>
                ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;