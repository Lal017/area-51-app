import { View } from "react-native";
import { Tabs} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CustHeader } from "../../components/components";
import { Styles } from "../../constants/styles";
import { AppProvider, useApp } from "../../components/context";
import { useEffect, useRef } from 'react';
import { generateClient } from "aws-amplify/api";
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, removeNotificationSubscription } from "expo-notifications";
import { registerForPushNotifications, handleCreatePushToken, handleUpdatePushToken } from "../../components/notifComponents";
import { listPushTokens } from "../../src/graphql/queries";
import Colors from "../../constants/colors";
import { handleGetCurrentUser } from "../../components/authComponents";
import { fetchUserAttributes } from "aws-amplify/auth";

const TabsContent = () =>
{
    // get setters from context
    const { client, setClient, userId, setUserId, access, setAccess, setPushToken, setNotification, name, setName, email, setEmail, phoneNumber, setPhoneNumber } = useApp();

    // notification listeners
    const notificationListener = useRef();
    const responseListener = useRef();

    // get and set user attributes
    useEffect(() => {
        const fetchUserData = async() => {
            try {
                const user = await fetchUserAttributes();
                setEmail(user?.email);
                setName(user?.name);
                setPhoneNumber(user?.phone_number);
            } catch (error) {
                console.log(error);
            }
        }

        fetchUserData();
    }, []);

    // send PushToken to database
    useEffect(() => {
        const client = generateClient();
        setClient(client);
    }, []);

    // listeners for notifications
    useEffect(() => {
        const handleSetUserId = async () =>
        {
            try {
                const user = await handleGetCurrentUser();
                setAccess(user.accessToken.payload["cognito:groups"]);
                setUserId(user.accessToken.payload.sub);
            } catch (error) {
                console.error('Error getting current user:', error);
            }
        };

        const handleRegisterPushNotifications = async () => {
            try {
                // get push token for notifications
                const token = await registerForPushNotifications();
                setPushToken(token);

                // check if client already has an entry in database
                const exists = await client.graphql({
                    query: listPushTokens,
                });

                const alreadyExists = exists.data.listPushTokens.items.length > 0;

                if (!alreadyExists) {
                    await handleCreatePushToken(client, userId, token, access, name, email, phoneNumber);
                } else {
                    await handleUpdatePushToken(client, userId, token, access, name, email, phoneNumber);
                }
            } catch (error) {
                console.error('Error registering for push notifications:', error);
                setPushToken(error.message);
            }
        };

        handleSetUserId();

        if (client && userId) {
            handleRegisterPushNotifications();
        }

    }, [phoneNumber, name, email]);

    useEffect(() => {
        // triggered when the notification is actually received. foreground and background
        notificationListener.current = addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        // triggered when the user taps on the notification
        responseListener.current = addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current && removeNotificationSubscription(notificationListener.current);
            responseListener.current && removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <Tabs
            screenOptions={{
                header: () => <CustHeader/>,
                tabBarStyle: Styles.tabBarStyle,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.tertiary,
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
                    title: "Schedule maintenance",
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={Styles.KeyIconContainer}>
                            <Ionicons
                                name="car"
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

const TabsLayout = () =>
{
    return (
        <AppProvider>
            <TabsContent/>
        </AppProvider>
    )
};

export default TabsLayout;