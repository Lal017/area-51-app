import { Stack, router } from "expo-router";
import { CustHeader } from "../../components/components";
import { AppProvider, useApp } from "../../components/context";
import { useEffect, useRef } from 'react';
import { Alert } from "react-native";
import { generateClient } from "aws-amplify/api";
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, removeNotificationSubscription } from "expo-notifications";
import { registerForPushNotifications, handleCreateUser, handleUpdateUser, handleCheckUser } from "../../components/notifComponents";
import { handleGetCurrentUser } from "../../components/authComponents";
import { fetchUserAttributes } from "aws-amplify/auth";
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
            await setPhoneNumber(userAtt?.phone_number);

            // get and set cognito info
            const userInfo = await handleGetCurrentUser();
            await setAccess(userInfo.accessToken.payload["cognito:groups"]);
            await setUserId(userInfo.accessToken.payload.sub);

            const savedNotif = await AsyncStorage.getItem('notification');
            setNotification(JSON.parse(savedNotif));

            if (!userAtt?.phone_number || ((!userAtt?.given_name || !userAtt?.family_name) && !userAtt?.name)) {
                router.replace('/(tabs)/(profile)/accountEdit');
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
                    await handleCreateUser(client, userId, pushToken, access, firstName, lastName, email, phoneNumber);
                } else {
                    await handleUpdateUser(client, userId, pushToken, access, firstName, lastName, email, phoneNumber);
                }
            } catch (error) {
                console.error('Error registering for push notifications:', error);
            }
        };

        if (client && userId && pushToken && access && firstName && lastName && email && phoneNumber) {
            handleRegisterPushNotifications();
        }
    }, [client, userId, pushToken, phoneNumber, firstName, lastName, email, access]);

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
        <Stack>
            <Stack.Screen name='index' options={{title: 'Admin Console', header: () => <CustHeader title="Console"/>}}/>
            <Stack.Screen name='userList' options={{title: 'Users', header: () => <CustHeader title="Users" />}}/>
            <Stack.Screen name='userView' options={{title: 'User List', header: () => <CustHeader title="User" />}}/>
            <Stack.Screen name='appointmentList' options={{title: 'Appointments', header: () => <CustHeader title="Appointments" />}}/>
            <Stack.Screen name='appointmentView' options={{title: 'Appointment', header: () => <CustHeader title="Appointment" />}}/>
            <Stack.Screen name='settings' options={{title: 'Settings', header: () => <CustHeader title="Settings" />}}/>
            <Stack.Screen name="accountEdit"  options={{title: "Edit Account", header: () => <CustHeader title="Account Edit" />}}/>
            <Stack.Screen name="resetPassword" options={{title: "Reset Password", header: () => <CustHeader title="Reset Password" />}}/>
            <Stack.Screen name="confirmAttribute" options={{title: "Confirm Change", header: () => <CustHeader title="Reset Password" />}}/>
            <Stack.Screen name="deleteAccount" options={{title: "Account Deletion", header: () => <CustHeader title="Account Deletion" />}}/>
            <Stack.Screen name="towRequests" options={{title: "Tow Requests", header: () => <CustHeader title="Tow Requests"/>}}/>
            <Stack.Screen name="towResponse" options={{title: "Tow Response", header: () => <CustHeader title="Tow Response"/>}}/>
            <Stack.Screen name="homeSettings" options={{title: "Home Settings", header: () => <CustHeader title="Home Settings"/>}}/>
        </Stack>
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