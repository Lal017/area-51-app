import { Stack, router } from "expo-router";
import { CustHeader, Loading } from "../../components/components";
import { AppProvider, useApp } from "../../components/context";
import { useEffect, useRef, useState } from 'react';
import { Alert } from "react-native";
import { generateClient } from "aws-amplify/api";
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, removeNotificationSubscription } from "expo-notifications";
import { registerForPushNotifications, handleCreateUser, handleUpdateUser, handleCheckUser } from "../../components/notifComponents";
import { handleGetCurrentUser } from "../../components/authComponents";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminContent = () =>
{
    // get setters from context
    const {
        client,
        setClient,
        userId,
        setUserId,
        access,
        setAccess,
        identityId,
        setIdentityId,
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

                if (nameSplit?.length >= 2) {
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

            // identityId for amplify storage
            const getDetails = await fetchAuthSession();
            setIdentityId(getDetails.identityId);

            // get local storage notification
            const savedNotif = await AsyncStorage.getItem('notification');
            setNotification(JSON.parse(savedNotif));

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
                router.push('accountEdit');
            }
        }

        initializeApp();
    }, []);

    // Send to database
    useEffect(() => {
        const handleRegisterPushNotifications = async () => {
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

        if (client && userId && identityId && access && pushToken) {
            setReady(true);
        }
        else {
            console.log('client', client, 'user', userId, 'identity', identityId, 'access', access, 'token', pushToken);
        }

        if (client && userId && identityId && pushToken && access && firstName && lastName && email && phoneNumber) {
            handleRegisterPushNotifications();
        }
    }, [client, userId, identityId, pushToken, phoneNumber, firstName, lastName, email, access]);

    // Listeners for push notifications
    useEffect(() => {
        // triggered when the notification is actually received. foreground and background
        notificationListener.current = addNotificationReceivedListener(notification => {
            setNotification(notification.request.content);
        });

        // triggered when the user taps on the notification
        responseListener.current = addNotificationResponseReceivedListener(response => {
            router.push('/index');
        });

        return () => {
            notificationListener.current && removeNotificationSubscription(notificationListener.current);
            responseListener.current && removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <>
        { ready ? (
            <Stack>
                <Stack.Screen name='index' options={{title: 'Admin Console', header: () => <CustHeader title="Console" index={true}/>}}/>
                <Stack.Screen name='(users)' options={{headerShown: false}}/>
                <Stack.Screen name='(appointments)' options={{headerShown: false}}/>
                <Stack.Screen name='(settings)' options={{headerShown: false}}/>
                <Stack.Screen name='vehicleList' options={{title: 'Vehicles', header: () => <CustHeader title="Vehicles" />}}/>
                <Stack.Screen name='vehicleView' options={{title: 'Vehicle', header: () => <CustHeader title="Vehicle" />}}/>
                <Stack.Screen name="towRequestList" options={{title: "Tow Requests", header: () => <CustHeader title="Tow Requests"/>}}/>
                <Stack.Screen name="towResponse" options={{title: "Tow Response", header: () => <CustHeader title="Tow Response"/>}}/>
                <Stack.Screen name="homeSettings" options={{title: "Home Settings", header: () => <CustHeader title="Home Settings"/>}}/>
            </Stack>
        ) : (
            <Loading/>
        )}
        </>
    );
}

const AdminLayout = () =>
{
    return (
        <AppProvider>
            <AdminContent />
        </AppProvider>
    );
};

export default AdminLayout;