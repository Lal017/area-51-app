import AccountEdit from '../../src/screens/accountEdit';
import Modal from 'react-native-modal';
import { ActionButton, Background, CustHeader, Loading } from "../../components/components";
import { AppProvider, useApp } from "../../components/context";
import { registerForPushNotifications } from "../../components/notifComponents";
import { handleCreateUser, handleUpdateUser, handleGetUser } from '../../components/userComponents';
import { handleGetCurrentUser } from "../../components/authComponents";
import { Styles } from '../../constants/styles';
import { Stack, router } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import { Linking, View, Text, TouchableOpacity } from 'react-native';
import { generateClient } from "aws-amplify/api";
import { getPermissionsAsync, addNotificationReceivedListener, addNotificationResponseReceivedListener } from "expo-notifications";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";

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
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        phoneNumber,
        setPhoneNumber,
        isMissingAttr,
        setIsMissingAttr
    } = useApp();

    // load components when finished fetching data
    const [ ready, setReady ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ permissionScreen, setPermissionScreen ] = useState(false);

    // notification listeners
    const notificationListener = useRef();
    const responseListener = useRef();

    const onRefresh = async () =>
    {
        setRefreshing(true);
        const permission = await getPermissionsAsync();
        if (permission.granted) {
            setPermissionScreen(false);
            if (router.canDismiss()) router.dismissAll();
            router.replace('(admin)');
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

            // generate client
            const genClient = generateClient();
            setClient(genClient);

            // get and set cognito info
            const userInfo = await handleGetCurrentUser();
            const access_arr = userInfo.accessToken.payload["cognito:groups"];
            const getAccess = access_arr.includes('Admins') ? 'Admins' : access_arr.includes('TowDrivers') ? 'TowDrivers' : 'Customers';
            setAccess(getAccess);
            setUserId(userInfo.accessToken.payload.sub);

        }

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

        if (client && userId) { setReady(true); }
        if (client && userId && identityId && pushToken && access && firstName && lastName && email && phoneNumber) {
            handleRegisterUser();
        }

    }, [client, userId, identityId, pushToken, phoneNumber, firstName, lastName, email, access]);

    // Listeners for push notifications
    useEffect(() => {
        // triggered when the notification is actually received. foreground and background
        notificationListener.current = addNotificationReceivedListener(notification => {
            console.log('Notification recieved');
        });

        // triggered when the user taps on the notification
        responseListener.current = addNotificationResponseReceivedListener(response => {
            router.push('/index');
        });

        return () => {
            notificationListener.current && notificationListener.current.remove();
            responseListener.current && responseListener.current.remove();
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
        <Modal
            isVisible={permissionScreen}
            onBackdropPress={null}
            onBackButtonPress={null}
            swipeDirection={null}
            style={{margin: 0}}
        >
            <Background style={{justifyContent: 'center'}} refreshing={refreshing} onRefresh={onRefresh}>
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