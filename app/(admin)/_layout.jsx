import { Stack, router } from "expo-router";
import { CustHeader } from "../../components/components";
import { AppProvider, useApp } from "../../components/context";
import { useEffect, useRef } from 'react';
import { generateClient } from "aws-amplify/api";
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, removeNotificationSubscription } from "expo-notifications";
import { registerForPushNotifications, handleCreateUser, handleUpdateUser, handleCheckUser } from "../../components/notifComponents";
import { handleGetCurrentUser } from "../../components/authComponents";
import { fetchUserAttributes } from "aws-amplify/auth";
import { vehiclesByUserId } from "../../src/graphql/queries";
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
            
            setNotification(JSON.parse(savedNotif));
            setRequest(JSON.parse(savedRequest));
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
                
                setVehicles(vehiclesInfo.data.vehiclesByUserId.items);
            } catch (error) {
                console.log('Error getting vehicles:', error);
            }
        }

        if (client && userId) { handleGetVehicles(); }
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
        // triggered when the notification is actually received. foreground and background
        notificationListener.current = addNotificationReceivedListener(notification => {
            console.log(notification.request.content);
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