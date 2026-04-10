import Colors from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AccountEdit from '../../src/screens/accountEdit';
import Modal from 'react-native-modal';
import LottieView from "lottie-react-native";
import { handleGetMyAppointments } from "../../services/appointmentService";
import { handleGetTowRequest, handleNotifUpdateTowRequest } from '../../services/towService';
import { ActionButton, Background, Loading } from "../../components/components";
import { handleGetVehicles, handleNotifUpdateVehicle } from "../../services/vehicleService";
import { handleSendAdminNotif, registerForPushNotifications } from "../../services/notificationService";
import { handleCreateUser, handleUpdateUser, handleGetUser } from '../../services/userService';
import { Styles } from "../../constants/styles";
import { AppProvider, useApp } from "../../hooks/useApp";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { router, Tabs} from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from 'react';
import { generateClient } from "aws-amplify/api";
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, useLastNotificationResponse, getPermissionsAsync } from "expo-notifications";
import { fetchUserAttributes, fetchAuthSession, signOut } from "aws-amplify/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useUser from "../../hooks/useUser";

const TabsContent = () =>
{
    // get variables and setters from context
    const {
        client,
        setClient,
        userId,
        identityId,
        setIdentityId,
        access,
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
        setCustomNotification,
        driverId,
        setDriverId
    } = useApp();

    // load components when finished fetching data
    const [ ready, setReady ] = useState(false);
    // if user is requesting to be a tow driver
    const [ waitingScreen, setWaitingScreen ] = useState();
    // ask user to refresh screen once they have been made a tow truck driver
    const [ refreshPrompt, setRefreshPrompt ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ permissionScreen, setPermissionScreen ] = useState(false);

    const lastNotificationResponse = useLastNotificationResponse();

    // notification listeners
    const notificationListener = useRef();
    const responseListener = useRef();

    // custom hooks
    const { initUser } = useUser();

    const onRefresh = async () =>
    {
        setRefreshing(true);
        if (router.canDismiss()) router.dismissAll();
        router.replace('(tow)');
        setRefreshing(false);
    };

    const onPermissionRefresh = async () =>
    {
        setRefreshing(true);
        try {
            const permission = await getPermissionsAsync();
            if (permission.granted) {
                setPermissionScreen(false);
                if (router.canDismiss()) router.dismissAll();
                router.replace('(tabs)');
            }
        } catch (error) {
            console.error(error);
        }
        setRefreshing(false);
    };

    // initialize data used for the app
    useEffect(() => {
        const initializeApp = async () =>
        {
            // get push token for notifications
            try {
                const genPushToken = await registerForPushNotifications();
                setPushToken(genPushToken);
            } catch (error) {
                setPermissionScreen(true);
                setReady(true);
                return;
            }

            try {
                // generate client
                const genClient = generateClient();
                setClient(genClient);

                // get and set cognito info
                await initUser();
                
                // get local storage data
                const savedInvoice = await AsyncStorage.getItem('invoice');
                setNewInvoice(JSON.parse(savedInvoice));
                const savedEstimate = await AsyncStorage.getItem('estimate');
                setNewEstimate(JSON.parse(savedEstimate));
                const savedCustomNotif = await AsyncStorage.getItem('customNotification');
                setCustomNotification(JSON.parse(savedCustomNotif));
            } catch (error) {
                console.error(error);
            }
        };

        initializeApp();
    }, []);

    useEffect(() => {
        if (lastNotificationResponse) {
            // triggered when a user opens the app by tapping on a notification
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
    }, [lastNotificationResponse]);

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

                // get vehicleIds that have an appointment scheduled for pickup
                const scheduledVehiclePickups = getAppointments
                    ?.filter(appt => appt.service === 'Vehicle Pickup')
                    .map(appt => appt.vehicle?.id);

                // set vehicles
                const getVehicles = await handleGetVehicles(client, userId);
                setVehicles(getVehicles);

                // filter out vehicles that already have a scheduled pickup appointment
                const filterVehicles = getVehicles
                    ?.some(item => item.readyForPickup === true && !scheduledVehiclePickups.includes(item.id));
                    
                setVehiclePickup(filterVehicles);

                // set driverId
                const user = await handleGetUser(client, userId);
                if (user?.driverId) { setDriverId(user?.driverId); }
                else { setDriverId('0'); }

                let userAtt;
                if (!user?.email || !user?.firstName || !user?.lastName || !user?.phone || !user?.identityId) {
                    userAtt = await fetchUserAttributes();
                }
                
                // set email
                if (!user?.email) { 
                    setEmail(userAtt?.email);
                } else { setEmail(user?.email); }

                // set name
                if (!user?.firstName || !user?.lastName) {
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

                    if ((!userAtt?.given_name || !userAtt?.family_name) && !userAtt?.name) {
                        setIsMissingAttr(true);
                    }
                } else { setFirstName(user?.firstName); setLastName(user?.lastName); }

                // set phone number
                if (!user?.phone) {
                    setPhoneNumber(userAtt?.phone_number);
                    if (!userAtt?.phone_number) {
                        setIsMissingAttr(true);
                    }
                } else { setPhoneNumber(user?.phone); }

                // set identityId (for amplify storage)
                if (!user?.identityId) {
                    const getDetails = await fetchAuthSession();
                    setIdentityId(getDetails.identityId);
                } else { setIdentityId(user?.identityId); }
            } catch (error) {
                console.error('ERROR, could not get user info:', error);
            }
        };

        if (client && userId) {
            handleGetRequests();
        }
    }, [client, userId]);

    // Send to database once all data has been generated and retrieved
    useEffect(() => {
        const handleRegisterUser = async () => {
            try {
                // check if user already has entry in database
                const user = await handleGetUser(client, userId);
                
                // check if user request to be a tow driver
                const getTowDriverRequest = await AsyncStorage.getItem('wantsToBeTowDriver');
                const check = JSON.parse(getTowDriverRequest);
                if (check) {
                    await AsyncStorage.removeItem('wantsToBeTowDriver');
                    setWaitingScreen(true);
                    await handleSendAdminNotif('Tow Driver Account Request', 'A user is requesting to become a tow driver');
                }
                else {
                    // set waiting screen if they've requested a tow account
                    if (driverId === '1') {
                        setWaitingScreen(true);
                    } else { setWaitingScreen(false); }
                }

                if (!user) {
                    await handleCreateUser(client, userId, identityId, pushToken, access, firstName, lastName, email, phoneNumber, check);
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
            setReady(true);
        };

        if (client && userId && identityId && pushToken && access && firstName && lastName && email && phoneNumber && driverId) {
            handleRegisterUser();
        }

    }, [client, userId, identityId, pushToken, phoneNumber, firstName, lastName, email, access, driverId]);

    // Listeners for push notifications
    useEffect(() => {
        // delay listener setup until client and userId is ready
        if(!client || !userId) return;

        // triggered when the notification is actually received. foreground and background
        notificationListener.current = addNotificationReceivedListener(async (notification) => {
            const { type } = notification.request.content.data;

            try {
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
                else if (type === "DRIVER_ACCOUNT") {
                    setRefreshPrompt(true);
                    await initUser();
                }
                else if (type === "CUSTOM_NOTIFICATION") {
                    await setCustomNotification(notification.request.content);
                }
            } catch (error) {
                console.error(error);
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
            notificationListener.current && notificationListener.current.remove();
            responseListener.current && responseListener.current.remove();
        };
    }, [client, userId]);

    const insets = useSafeAreaInsets();

    return (
        <>
        { waitingScreen === true ? (
            <Background style={{justifyContent: 'center'}} refreshing={refreshing} onRefresh={onRefresh}>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        right: 20,
                        top: insets.top,
                        justifyContent: 'center'
                    }}
                    onPress={async () => {
                        try {
                            await signOut({global: true });
                        } catch (error) {
                            console.error('ERROR, could not sign out', error);
                        }
                    }}
                >
                    <MaterialIcons name='logout' size={30} color='white'/>
                </TouchableOpacity>
                { refreshPrompt && (
                    <View style={{position: 'absolute', top: 25}}>
                        <LottieView
                            source={require('../../assets/animations/scrollDown.json')}
                            loop={true}
                            autoPlay={true}
                            style={{width: 150, height: 150}}
                        />
                    </View>
                )}
                <View style={Styles.infoContainer}>
                    <Text style={[Styles.title, {textAlign: 'center'}]}>{ refreshPrompt ? `Refresh` : `Tow Driver Account`}</Text>
                    <Text style={[Styles.text, {textAlign: 'center'}]}>{ refreshPrompt ? `Please refresh the screen` : `We're reviewing your request. We'll notify you once you've been granted access.`}</Text>
                </View>
                <LottieView
                    source={require('../../assets/animations/astronaut.json')}
                    loop={true}
                    autoPlay={true}
                    speed={0.5}
                    style={{width: 150, height: 150}}
                />
            </Background>
        ) : ready && waitingScreen === false ? (
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: Colors.backgroundShade,
                        borderTopWidth: 0,
                        elevation: 0,
                    },
                    tabBarActiveTintColor: Colors.secondary,
                    tabBarInactiveTintColor: Colors.accent,
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
                            <View style={{
                                width: 75, height: 75,
                                backgroundColor: Colors.accent,
                                borderRadius: 100,
                                justifyContent: 'center', alignItems: 'center',
                            }}>
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
            isVisible={permissionScreen}
            onBackdropPress={null}
            onBackButtonPress={null}
            swipeDirection={null}
            style={{margin: 0}}
        >
            <Background style={{justifyContent: 'center'}} refreshing={refreshing} onRefresh={onPermissionRefresh}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.subTitle}>NOTICE</Text>
                    <Text style={Styles.text}>This app requires push notification permissions to function properly</Text>
                </View>
                <View style={Styles.block}>
                    <ActionButton
                        text='Settings'
                        onPress={async () => Linking.openSettings()}
                    />
                </View>
            </Background>
        </Modal>
        { !permissionScreen && (
            <Modal
                isVisible={isMissingAttr}
                onBackdropPress={null}
                onBackButtonPress={null}
                swipeDirection={null}
                style={{margin: 0}}
            >
                <AccountEdit/>
            </Modal>
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