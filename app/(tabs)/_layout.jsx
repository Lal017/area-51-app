import { View } from "react-native";
import { router, Tabs} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CustHeader } from "../../components/components";
import { Styles } from "../../constants/styles";
import { AppProvider, useApp } from "../../components/context";
import { useEffect, useRef } from 'react';
import { generateClient } from "aws-amplify/api";
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, removeNotificationSubscription } from "expo-notifications";
import { registerForPushNotifications, handleCreateUser, handleUpdateUser, handleCheckUser } from "../../components/notifComponents";
import Colors from "../../constants/colors";
import { handleGetCurrentUser } from "../../components/authComponents";
import { fetchUserAttributes } from "aws-amplify/auth";
import { listVehicles } from "../../src/graphql/queries";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TabsContent = () =>
{
    // get setters from context
    const {
        client,
        setClient,
        userId,
        setUserId,
        access,
        setAccess,
        pushToken,
        setPushToken,
        setNotification,
        name,
        setName,
        email,
        setEmail,
        phoneNumber,
        setPhoneNumber,
        setRequest,
        setVehicles } = useApp();

    // notification listeners
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        const initializeApp = async () =>
        {
            // generate client
            const genClient = generateClient();
            await setClient(genClient);

            // get push token for notifications
            const genPushToken = await registerForPushNotifications();
            await setPushToken(genPushToken);

            // get and set user attributes
            const userAtt = await fetchUserAttributes();
            await setEmail(userAtt?.email);
            await setName(userAtt?.name);
            await setPhoneNumber(userAtt?.phone_number);

            // get and set cognito info
            const userInfo = await handleGetCurrentUser();
            await setAccess(userInfo.accessToken.payload["cognito:groups"]);
            await setUserId(userInfo.accessToken.payload.sub);

            const savedNotif = await AsyncStorage.getItem('notification');
            const savedRequest = await AsyncStorage.getItem('request');
            if (savedNotif !== null) {
                setNotification(JSON.parse(savedNotif));
                setRequest(JSON.parse(savedRequest));
            }
        }

        initializeApp();
    }, []);

    useEffect(() => {
        const handleGetVehicles = async () =>
        {
            // get vehicles info from database
            const vehiclesInfo = await client.graphql({
                query: listVehicles,
            });
        
            setVehicles(vehiclesInfo.data.listVehicles.items);
        }

        if (client) { handleGetVehicles(); }
    }, [client])

    // Send to database
    useEffect(() => {
        const handleRegisterPushNotifications = async () => {
            try {
                // check if user already has entry in database
                const alreadyExists = await handleCheckUser(client, userId);

                if (!alreadyExists) {
                    await handleCreateUser(client, userId, pushToken, access, name, email, phoneNumber);
                } else {
                    await handleUpdateUser(client, userId, pushToken, access, name, email, phoneNumber);
                }
            } catch (error) {
                console.error('Error registering for push notifications:', error);
            }
        };

        if (client && userId && pushToken && access && name && email && phoneNumber) {
            handleRegisterPushNotifications();
        }

    }, [client, userId, pushToken, phoneNumber, name, email, access]);

    // Listeners for push notifications
    useEffect(() => {
        // triggered when the notification is actually received. foreground and background
        notificationListener.current = addNotificationReceivedListener(notification => {
            console.log(notification.request.content);
            setNotification(notification.request.content);
        });

        // triggered when the user taps on the notification
        responseListener.current = addNotificationResponseReceivedListener(response => {
            router.push('(home)');
        });

        return () => {
            notificationListener.current && removeNotificationSubscription(notificationListener.current);
            responseListener.current && removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: Styles.tabBarStyle,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.backgroundAccent,
                tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="(home)"
                options={{
                title: 'Home',
                headerShown: true,
                header: () => <CustHeader title="Home"/>,
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color}/>
                ),
                }}
            />
            <Tabs.Screen
                name="(schedule)"
                options={{
                    title: "Schedule maintenance",
                    headerShown: true,
                    header: () => <CustHeader title="Schedule"/>,
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={Styles.KeyIconContainer}>
                            <Ionicons
                                name="car-sport"
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