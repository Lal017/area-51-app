import { View, Alert } from "react-native";
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
import { vehiclesByUserId } from "../../src/graphql/queries";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleGetTowRequest, handleNotifUpdateTowRequest } from "../../components/scheduleComponents";

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
        setVehicles,
        setTowRequest
    } = useApp();

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
            setNotification(JSON.parse(savedNotif));

            if (!userAtt?.phone_number) {
                Alert.alert(
                    'NOTICE',
                    'Please add a phone number before continuing',
                    [
                        {
                            text: 'Settings',
                            onPress: () => router.push('/(tabs)/(profile)/accountEdit')
                        }
                    ]
                );
            }
        }

        initializeApp();
    }, []);

    useEffect(() => {
        const handleGetVehicles = async () =>
        {
            try {
                // get vehicles info from database
                const vehiclesInfo = await client.graphql({
                    query: vehiclesByUserId,
                    variables: {
                        userId: userId,
                    }
                });
                
                await setVehicles(vehiclesInfo.data.vehiclesByUserId.items);
            } catch (error) {
                console.log('Error getting vehicles:', error);
            }
        }

        const handleGetRequests = async () =>
        {
            try {
                // set active tow request
                const getTowRequest = await handleGetTowRequest(client, userId);
                await setTowRequest(getTowRequest);
            } catch (error) {
                console.log('Error getting tow request:', error);
            }
        }

        if (client && userId) {
            handleGetVehicles();
            handleGetRequests();
        }
    }, [client, userId])

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
        // delay listener setup until client and userId is ready
        if(!client || !userId) return;

        // triggered when the notification is actually received. foreground and background
        notificationListener.current = addNotificationReceivedListener(notification => {
            setNotification(notification.request.content);

            if(notification.request.content.data.type === "TOW_RESPONSE"){
                handleNotifUpdateTowRequest(client, userId, setTowRequest);
            }
        });

        // triggered when the user taps on the notification
        responseListener.current = addNotificationResponseReceivedListener(response => {
            router.push('/');
        });

        return () => {
            notificationListener.current && removeNotificationSubscription(notificationListener.current);
            responseListener.current && removeNotificationSubscription(responseListener.current);
        };
    }, [client, userId]);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: Styles.tabBarStyle,
                tabBarActiveTintColor: Colors.secondary,
                tabBarInactiveTintColor: Colors.backDropAccent,
                tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="(home)"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="(service)"
                options={{
                    title: "Services",
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={Styles.carIconContainer}>
                            <Ionicons
                                name="car-sport"
                                size={size} 
                                color={focused ? color: "black"} 
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                    title: "Profile",
                    headerShown: false,
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