import Colors from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AccountEdit from '../../src/screens/accountEdit';
import Modal from 'react-native-modal';
import { handleGetMyAppointments } from "../../components/appointmentComponents";
import { handleGetTowRequest, handleNotifUpdateTowRequest } from '../../components/towComponents';
import { Loading } from "../../components/components";
import { handleGetVehicles, handleNotifUpdateVehicle } from "../../components/vehicleComponents";
import { registerForPushNotifications } from "../../components/notifComponents";
import { handleCreateUser, handleUpdateUser, handleGetUser } from '../../components/userComponents';
import { handleGetCurrentUser } from "../../components/authComponents";
import { Styles } from "../../constants/styles";
import { AppProvider, useApp } from "../../components/context";
import { View } from "react-native";
import { router, Tabs} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from 'react';
import { generateClient } from "aws-amplify/api";
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, removeNotificationSubscription, getLastNotificationResponseAsync } from "expo-notifications";
import { fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";
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
        newInvoice,
        setNewInvoice,
        newEstimate,
        setNewEstimate,
        vehiclePickup,
        setVehiclePickup,
        isMissingAttr,
        setIsMissingAttr,
        setCustomNotification
    } = useApp();

    // load components when finished fetching data
    const [ ready, setReady ] = useState(false);

    // notification listeners
    const notificationListener = useRef();
    const responseListener = useRef();

    // initialize data used for the app
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
            const access_arr = userInfo.accessToken.payload["cognito:groups"];
            const getAccess = access_arr.includes('Admins') ? 'Admins' : access_arr.includes('TowDrivers') ? 'TowDrivers' : 'Customers';
            setAccess(getAccess);
            setUserId(userInfo.accessToken.payload.sub);

            // identityId for amplify storage
            const getDetails = await fetchAuthSession();
            setIdentityId(getDetails.identityId);

            // triggered when a user opens the app by tapping on a notification
            const lastNotificationResponse = await getLastNotificationResponseAsync();
            if (lastNotificationResponse) {
                const type = lastNotificationResponse.notification.request.content.data.type;
                if (type === "NEW_INVOICE") {
                    setNewInvoice(true);
                    router.push('(profile)');
                } else if (type === "NEW_ESTIMATE") {
                    setNewEstimate(true);
                    router.push('(profile)');
                } else if (type === "VEHICLE_PICKUP") {
                    router.push('(profile)');
                } else if (type === "CUSTOM_NOTIFICATION") {
                    setCustomNotification(lastNotificationResponse.notification.request.content);
                }
            }

            // get local storage data
            const savedInvoice = await AsyncStorage.getItem('invoice');
            setNewInvoice(JSON.parse(savedInvoice));
            const savedEstimate = await AsyncStorage.getItem('estimate');
            setNewEstimate(JSON.parse(savedEstimate));
            const savedCustomNotif = await AsyncStorage.getItem('customNotification');
            setCustomNotification(JSON.parse(savedCustomNotif));


            if (!userAtt?.phone_number || ((!userAtt?.given_name || !userAtt?.family_name) && !userAtt?.name)) {
                setIsMissingAttr(true);
            }
        }

        initializeApp();
    }, []);

    // called once client and userId have been set
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
                console.error('ERROR, could not get requests:', error);
            }
        }

        if (client && userId) {
            handleGetRequests();
            setReady(true);
        }
    }, [client, userId])

    // Send to database once all data has been generated and retrieved
    useEffect(() => {
        const handleRegisterUser = async () => {
            try {
                // check if user already has entry in database
                const user = await handleGetUser(client, userId);

                if (!user) {
                    await handleCreateUser(client, userId, identityId, pushToken, access, firstName, lastName, email, phoneNumber);
                } else {
                    // check if anything has changed
                    const isSame =
                        identityId === user.identityId &&
                        pushToken === user.pushToken &&
                        access === user.access &&
                        firstName === user.firstName &&
                        lastName === user.lastName &&
                        email === user.email &&
                        phoneNumber === user.phone;

                    if (!isSame) await handleUpdateUser(client, userId, identityId, pushToken, access, firstName, lastName, email, phoneNumber);
                }
            } catch (error) {
                console.error('ERROR, could not send info to database', error);
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
        notificationListener.current = addNotificationReceivedListener(async (notification) => {
            const { type } = notification.request.content.data;

            if (type === "TOW_RESPONSE") {
                await handleNotifUpdateTowRequest(client, userId, setTowRequest);
            }
            else if (type === "NEW_INVOICE") {
                await setNewInvoice(true);
            }
            else if (type === "NEW_ESTIMATE") {
                await setNewEstimate(true);
            }
            else if (type === "VEHICLE_PICKUP") {
                await handleNotifUpdateVehicle(client, userId, setVehicles);
                setVehiclePickup(prev => !prev);
            }
            else if (type === "CUSTOM_NOTIFICATION") {
                await setCustomNotification(notification.request.content);
            }
        });

        // triggered when the user taps on the notification
        responseListener.current = addNotificationResponseReceivedListener(response => {
            const { type } = response.notification.request.content.data;

            if (type === "TOW_RESPONSE") {
                router.push('(tabs)');
            }
            else if (type === "NEW_INVOICE") {
                router.push('(profile)');
            }
            else if (type === "NEW_ESTIMATE") {
                router.push('(profile)');
            }
            else if (type === "VEHICLE_PICKUP") {
                router.push('(profile)');
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
                        tabBarBadge: towRequest?.status === 'IN_PROGRESS' ? (1) : undefined,
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
        <Modal
            isVisible={isMissingAttr}
            onBackdropPress={null}
            onBackButtonPress={null}
            swipeDirection={null}
            style={{margin: 0}}
        >
            <AccountEdit/>
        </Modal>
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