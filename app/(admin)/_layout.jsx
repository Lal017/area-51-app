import AccountEdit from '../../src/screens/accountEdit';
import Modal from 'react-native-modal';
import { ActionButton, Background, CustHeader, Loading } from "../../components/components";
import { AppProvider, useApp } from "../../hooks/useApp";
import { registerForPushNotifications } from "../../services/notificationService";
import { handleCreateUser, handleUpdateUser, handleGetUser } from '../../services/userService';
import { Styles } from '../../constants/styles';
import { Stack, router } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import { Linking, View, Text } from 'react-native';
import { generateClient } from "aws-amplify/api";
import { getPermissionsAsync, addNotificationReceivedListener, addNotificationResponseReceivedListener } from "expo-notifications";
import useUser from '../../hooks/useUser';
import useInitData from '../../hooks/useInitData';

const AdminContent = () =>
{
    const {
        client, setClient,
        userId, identityId, access,
        pushToken, setPushToken,
        firstName, lastName, email, phoneNumber,
        isMissingAttr
    } = useApp();

    // load components when finished fetching data
    const [ ready, setReady ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ permissionScreen, setPermissionScreen ] = useState(false);

    // notification listeners
    const notificationListener = useRef();
    const responseListener = useRef();

    // custom hooks
    const { initUser } = useUser();
    const { initData } = useInitData();

    const onRefresh = async () =>
    {
        setRefreshing(true);
        try {
            const permission = await getPermissionsAsync();
            if (permission.granted) {
                setPermissionScreen(false);
                if (router.canDismiss()) router.dismissAll();
                router.replace('(admin)');
            }
        } catch (error) {
            console.error('Could not refresh:', error);
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
                console.error(error);
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
            } catch (error) {
                console.error('Error initializing app:', error);
            }

        }

        initializeApp();
    }, []);

    useEffect(() => {
        const handleGetRequests = async () =>
        {
            try {
                // custom hook to initialize data
                await initData();
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
        notificationListener.current = addNotificationReceivedListener(() => {
            console.log('Notification recieved');
        });

        // triggered when the user taps on the notification
        responseListener.current = addNotificationResponseReceivedListener(() => {
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