import AccountEdit from '../../src/screens/accountEdit';
import Modal from 'react-native-modal';
import * as TaskManager from 'expo-task-manager';
import { CustHeader, Loading } from "../../components/components";
import { AppProvider, useApp } from "../../components/context";
import { registerForPushNotifications } from "../../components/notifComponents";
import { handleGetCurrentUser } from "../../components/authComponents";
import { getTowRequest } from '../../src/graphql/queries';
import { updateTowRequest } from '../../src/graphql/mutations';
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, removeNotificationSubscription } from "expo-notifications";
import { handleGetUser, handleCreateUser, handleUpdateUser } from "../../components/userComponents";
import { Stack } from "expo-router";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { fetchUserAttributes, fetchAuthSession } from "@aws-amplify/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stopWatchingLocation } from '../../components/towComponents';

const LOCATION_TASK_NAME = "area51-background-location-task";

// define task to track tow truck drivers location
TaskManager.defineTask(LOCATION_TASK_NAME, async ({data, error}) => {
    if (error || !data) return;

    const { locations } = data;
    const { latitude, longitude } = locations[0].coords;
    const client = generateClient();
    const requestId = await AsyncStorage.getItem('requestId');

    try {
        const result = await client.graphql({
            query: getTowRequest,
            variables: {
                id: requestId
            }
        });

        if (result?.data?.getTowRequest?.status !== 'IN_PROGRESS') {
            await stopWatchingLocation();
        }
        await client.graphql({
            query: updateTowRequest,
            variables: {
                input: {
                    id: requestId,
                    driverLatitude: latitude,
                    driverLongitude: longitude
                }
            }
        });
    } catch (error) {
        console.error('ERROR, could not send coordinates to database:', error);
    }
});

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
        isMissingAttr,
        setIsMissingAttr,
        setDriverId
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

            // get and set cognito info
            const userInfo = await handleGetCurrentUser();
            const access_arr = userInfo.accessToken.payload["cognito:groups"];
            const getAccess = access_arr.includes('Admins') ? 'Admins' : access_arr.includes('TowDrivers') ? 'TowDrivers' : 'Customers';
            setAccess(getAccess);
            setUserId(userInfo.accessToken.payload.sub);
        };

        initializeApp();
    }, []);

    useEffect(() => {
        const handleGetRequests = async () =>
        {
            try {
                // get user info from database
                const user = await handleGetUser(client, userId);
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

        const handleGetDriverId = async () =>
        {
            try {
                // set driverId
                const user = await handleGetUser(client, userId);
                setDriverId(user?.driverId);
            } catch (error) {
                console.error('ERROR, could not get driverId from database:', error);
            }
        };

        if (client && userId) { setReady(true); }
        if (client && userId && identityId && pushToken && access && firstName && lastName && email && phoneNumber) {
            handleRegisterUser();
            handleGetDriverId(client, userId);
        }

    }, [client, userId, identityId, pushToken, phoneNumber, firstName, lastName, email, access]);

    // Listeners for push notifications
    useEffect(() => {
        // triggered when the notification is actually received. foreground and background
        notificationListener.current = addNotificationReceivedListener(notification => {
            console.log('Notification received');
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
        <>
        { ready ? (
            <Stack
                screenOptions={{
                    headerShown: true
                }}
            >
                <Stack.Screen name="index" options={{title: 'Console', header: () => <CustHeader title='Console'/>}}/>
                <Stack.Screen name="(settings)" options={{headerShown: false}}/>
                <Stack.Screen name="(requests)" options={{headerShown: false}}/>
            </Stack>
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

const TowDriverLayout = () =>
{
    return(
        <AppProvider>
            <TowDriverContent/>
        </AppProvider>
    )
}
export default TowDriverLayout;