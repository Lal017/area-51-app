import { View, Alert } from "react-native";
import { router, Tabs} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Styles } from "../../constants/styles";
import { AppProvider, useApp } from "../../components/context";
import { useEffect, useRef, useState } from 'react';
import { generateClient } from "aws-amplify/api";
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, removeNotificationSubscription, getLastNotificationResponseAsync } from "expo-notifications";
import { registerForPushNotifications, handleCreateUser, handleUpdateUser, handleCheckUser } from "../../components/notifComponents";
import Colors from "../../constants/colors";
import { handleGetCurrentUser } from "../../components/authComponents";
import { fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleGetMyAppointments, handleGetTowRequest, handleNotifUpdateTowRequest } from "../../components/scheduleComponents";
import { Loading } from "../../components/components";
import { handleGetVehicles, handleUpdateVehiclePickup } from "../../components/vehicleComponents";

const TabsContent = () =>
{
    // get variables and setters from context
    const {
        client,
        setClient,
        userId,
        setUserId,
        identityId,
        setIdentityId,
        access,
        setAccess,
        pushToken,
        setPushToken,
        setNotification,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        phoneNumber,
        setPhoneNumber,
        setVehicles,
        towRequest,
        setTowRequest,
        setAppointments,
        setIsStuck,
        newInvoice,
        setNewInvoice,
        newEstimate,
        setNewEstimate,
        vehiclePickup,
        setVehiclePickup
    } = useApp();

    const [ ready, setReady ] = useState(false);

    // notification listeners
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        const initializeApp = async () =>
        {
            // generate client
            const genClient = generateClient();
            setClient(genClient);

            // get push token for notifications
            const genPushToken = await registerForPushNotifications();
            setPushToken(genPushToken);

            // get and set user attributes
            const userAtt = await fetchUserAttributes();
            setEmail(userAtt?.email);
            if (userAtt.given_name && userAtt.family_name) {
                setFirstName(userAtt.given_name);
                setLastName(userAtt.family_name);
            } else if (userAtt.name) {
                const nameSplit = userAtt.name.trim().split(/\s+/);

                if (nameSplit.length >= 2) {
                    setFirstName(nameSplit[0]);
                    setLastName(nameSplit.slice(1).join(' '));
                } else {
                    setFirstName(nameSplit[0]);
                }
            }
            setPhoneNumber(userAtt?.phone_number);

            // get and set cognito info
            const userInfo = await handleGetCurrentUser();
            setAccess(userInfo.accessToken.payload["cognito:groups"]);
            setUserId(userInfo.accessToken.payload.sub);

            const getDetails = await fetchAuthSession();
            setIdentityId(getDetails.identityId);

            // get local storage notification
            const savedNotif = await AsyncStorage.getItem('notification');
            setNotification(JSON.parse(savedNotif));

            const lastNotificationResponse = await getLastNotificationResponseAsync();

            if (lastNotificationResponse) {
                const type = lastNotificationResponse.notification.request.content.data.type;
                if (type === "NEW_INVOICE") {
                    setNewInvoice(true);
                } else if (type === "NEW_ESTIMATE") {
                    setNewEstimate(true);
                } else if (type === "VEHICLE_PICKUP") {
                    setVehiclePickup(true);
                }
            }

            // get local storage invoice and estimate
            const savedInvoice = await AsyncStorage.getItem('invoice');
            setNewInvoice(JSON.parse(savedInvoice));
            const savedEstimate = await AsyncStorage.getItem('estimate');
            setNewEstimate(JSON.parse(savedEstimate));

            if (!userAtt?.phone_number || ((!userAtt?.given_name || !userAtt?.family_name) && !userAtt?.name)) {
                setIsStuck(true);
                Alert.alert(
                    'Notice',
                    'Please add missing attributes before continuing',
                    [
                        {
                            text: 'OK',
                        }
                    ]
                );
                router.push('/(tabs)/(profile)/accountEdit');
            }
        }

        initializeApp();
    }, []);

    useEffect(() => {
        const handleGetRequests = async () =>
        {
            try {
                // set active tow request
                const getTowRequest = await handleGetTowRequest(client, userId);
                setTowRequest(getTowRequest);

                // set upcoming appointments
                const getAppointments = await handleGetMyAppointments(client, userId);
                setAppointments(getAppointments);

                // set vehicles
                const getVehicles = await handleGetVehicles(client, userId);
                setVehicles(getVehicles);
                const filterVehicles = getVehicles?.some(item => item.readyForPickup === true);
                setVehiclePickup(filterVehicles);
            } catch (error) {
                console.log('Error getting request:', error);
            }
        }

        if (client && userId) {
            handleGetRequests();
            setReady(true);
        }
    }, [client, userId])

    // Send to database
    useEffect(() => {
        const handleRegisterUser = async () => {
            try {
                // check if user already has entry in database
                const alreadyExists = await handleCheckUser(client, userId);

                if (!alreadyExists) {
                    await handleCreateUser(client, userId, identityId, pushToken, access, firstName, lastName, email, phoneNumber);
                } else {
                    await handleUpdateUser(client, userId, identityId, pushToken, access, firstName, lastName, email, phoneNumber);
                }
            } catch (error) {
                console.error('Error registering for push notifications:', error);
            }
        };

        if (client && userId && identityId && pushToken && access && firstName && lastName && email && phoneNumber) {
            handleRegisterUser();
        }

    }, [client, userId, identityId, pushToken, phoneNumber, firstName, lastName, email, access]);

    // Listeners for push notifications
    useEffect(() => {
        // delay listener setup until client and userId is ready
        if(!client || !userId) return;

        // triggered when the notification is actually received. foreground and background
        notificationListener.current = addNotificationReceivedListener(notification => {
            setNotification(notification.request.content);

            if (notification.request.content.data.type === "TOW_RESPONSE") {
                handleNotifUpdateTowRequest(client, userId, setTowRequest);
            }
            else if (notification.request.content.data.type === "NEW_INVOICE") {
                setNewInvoice(true);
            }
            else if (notification.request.content.data.type === "NEW_ESTIMATE") {
                setNewEstimate(true);
            }
            else if (notification.request.content.data.type === "VEHICLE_PICKUP") {
                handleUpdateVehiclePickup(client, userId, setVehicles);
                setVehiclePickup(true);
            }
        });

        // triggered when the user taps on the notification
        responseListener.current = addNotificationResponseReceivedListener(response => {
            if (response.notification.request.content.data.type === "TOW_RESPONSE") {
                router.push('/(tabs)/(service)/towStatus');
            }
            else if (response.notification.request.content.data.type === "NEW_INVOICE") {
                router.push('/(tabs)/(profile)/invoices');
            }
            else if (response.notification.request.content.data.type === "NEW_ESTIMATE") {
                router.push('/tabs)/(profile)/estimates');
            }
            else if (response.notification.request.content.data.type === "VEHICLE_PICKUP") {
                router.push('/(tabs)/(profile)/vehicleList');
            }
        });

        return () => {
            notificationListener.current && removeNotificationSubscription(notificationListener.current);
            responseListener.current && removeNotificationSubscription(responseListener.current);
        };
    }, [client, userId]);

    return (
        <>
        { ready ? (
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: Styles.tabBarStyle,
                    tabBarActiveTintColor: Colors.secondary,
                    tabBarInactiveTintColor: Colors.backDropAccent,
                    tabBarShowLabel: false,
                }}
                screenListeners={{
                    tabPress: (e) => {
                        if (!firstName || !lastName || !phoneNumber || !email) {
                            e.preventDefault();
                            Alert.alert(
                                'Notice',
                                'Please add missing attributes before continuing',
                                [{ text: 'OK'}]
                            );
                        }
                    }
                }}
            >
                <Tabs.Screen
                    name="(home)"
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarHideOnKeyboard: true,
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color}/>
                        ),
                        tabBarBadge: towRequest?.status === 'PENDING' ? (1) : undefined,
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
                        tabBarBadge: newInvoice && newEstimate && vehiclePickup ? (3) : [newInvoice, newEstimate, vehiclePickup].filter(Boolean).length === 2 ? (2) : newInvoice || newEstimate || vehiclePickup ? (1) : undefined, 
                    }}
                />
            </Tabs>
        ) : (
            <Loading/>
        )}
        </>
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