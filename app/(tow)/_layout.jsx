import AccountEdit from '../../src/screens/accountEdit';
import Modal from 'react-native-modal';
import { ActionButton, Background, CustHeader, Loading } from "../../components/components";
import { AppProvider, useApp } from "../../hooks/useApp";
import { registerForPushNotifications } from "../../services/notificationService";
import { Styles } from '../../constants/styles';
import { handleGetUser, handleCreateUser, handleUpdateUser } from "../../services/userService";
import { getPermissionsAsync, addNotificationReceivedListener, addNotificationResponseReceivedListener } from "expo-notifications";
import { Stack, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, Linking } from 'react-native';
import { generateClient } from "aws-amplify/api";
import useUser from '../../hooks/useUser';
import useInitData from '../../hooks/useInitData';

const TowDriverContent = () =>
{
    const {
        client, setClient,
        userId, identityId, access,
        pushToken, setPushToken,
        firstName, lastName, email, phoneNumber,
        isMissingAttr, setDriverId
    } = useApp();

    // load components when finished fetching data
    const [ ready, setReady ] = useState(false);
    const [ permissionScreen, setPermissionScreen ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);

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
                router.replace('(tow)');
            }
        } catch (error) {
            console.error(error);
        }
        setRefreshing(false);
    }

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

                // custom hook to initialize cognito info
                await initUser();
            } catch (error) {
                console.error('error initializing app:', error);
            }
        };

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
            notificationListener.current && notificationListener.current.remove();
            responseListener.current && responseListener.current.remove();
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