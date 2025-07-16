import { Stack } from "expo-router";
import { Alert } from "react-native";
import { CustHeader } from "../../components/components";
import { AppProvider, useApp } from "../../components/context";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { registerForPushNotifications, handleCheckUser, handleCreateUser, handleUpdateUser } from "../../components/notifComponents";
import { fetchUserAttributes, fetchAuthSession } from "@aws-amplify/auth";
import { handleGetCurrentUser } from "../../components/authComponents";
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, removeNotificationSubscription } from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TowDriverContent = () =>
{
    const {
        client,
        setClient,
        userId,
        setUserId,
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
        access,
        setAccess,
        identityId,
        setIdentityId,
        setNotification,
        setIsStuck
    } = useApp();

    const [ ready, setReady ] = useState();

    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        const initializeApp = async () =>
        {
            // generate client
            const getClient = generateClient();
            setClient(getClient);

            // get push token for notifications
            const getPushToken = await registerForPushNotifications();
            setPushToken(getPushToken);

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
            }
        };

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

        if (client && userId && access && pushToken) {
            setReady(true);
        }

        if (client && userId && pushToken && access && identityId && firstName && lastName && email && phoneNumber) {
            handleRegisterPushNotifications();
        }
    }, [client, userId, pushToken, identityId, phoneNumber, firstName, lastName, email, access]);

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
    
    return(
        <Stack
            screenOptions={{
                headerShown: true
            }}
        >
            <Stack.Screen name="index" options={{title: 'Console', header: () => <CustHeader title='Console'/>}}/>
            <Stack.Screen name="(settings)" options={{headerShown: false}}/>
            <Stack.Screen name="(requests)" options={{headerShown: false}}/>
        </Stack>
    );
};

const TowDriverLayout = () =>
{
    return(
        <AppProvider>
            <TowDriverContent/>
        </AppProvider>
    )
}
export default TowDriverLayout;