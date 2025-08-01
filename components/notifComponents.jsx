import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Alert } from 'react-native';
import { post } from 'aws-amplify/api';

// ------------------------------------
//              ADMINS
// ------------------------------------

// sends a push notification to a specific user
const sendPushNotification = async (expoPushToken, title, body, data) =>
{
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: data
    };

    try {
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

// used to send a notification to all users
// (may need to edit to only send to customers group)
const sendMassPushNotification = async (client, title, body, data) =>
{
    try {
        const users = await handleListUsers(client);
        const expoPushTokens = users.map(user => user.pushToken);

        const message = {
            to: expoPushTokens,
            sound: 'default',
            title: title,
            body: body,
            data: data
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    } catch (error) {
        console.error('ERROR, could not send mass push notification:', error);
    }
};


// -----------------------------------
//              CUSTOMERS
// -----------------------------------

// sends notification to all users in Admins groups
const handleSendAdminNotif = async (title, content, data) =>
{
    try {
        const restOperation = post({
            apiName: 'area51RestApi',
            path: '/sendNotifToAdmins',
            options: {
                body: {
                    title: title,
                    content: content,
                    data: data
                }
            }
        });

        const { body } = await restOperation.response;
        const response = await body.json();

        if (response?.data?.listUsers?.items?.length <= 0) {
            console.error('ERROR, could not find any admin accounts', response.data.listUsers);
        }
    } catch (error) {
        console.error('ERROR, could not send notification to admins:', error);
    }
};

// send notification to all users in TowDrivers group
const handleSendDriversNotif = async (title, content, data) =>
{
    try {
        const restOperation = post({
            apiName: 'area51RestApi',
            path: '/sendNotifToDrivers',
            options: {
                body: {
                    title: title,
                    content: content,
                    data: data
                }
            }
        });

        const { body } = await restOperation.response;
        const response = await body.json();

        if (response?.data?.listUsers?.items?.length <= 0) {
            console.error('ERROR, could not find TowDrivers', response.data.listUsers);
        }
    } catch (error) {
        console.error('ERROR, could not send notification to TowDrivers', error);
    }
};

// ------------------------------------------
//              DO NOT EDIT
// ------------------------------------------

const handleRegistrationError = (errMessage) =>
{
    console.error('ERROR,', errMessage);
    throw new Error(errMessage);
};

const registerForPushNotifications = async () =>
{
    Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#000000',
    });

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission was not granted to get token');
            return;
        }
        
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            return pushTokenString;
        } catch (error) {
            handleRegistrationError(error.message);
        }
    } else {
        handleRegistrationError('Must use physical device for Push Notifications');
    }
};

export {
    sendPushNotification,
    sendMassPushNotification,
    handleSendAdminNotif,
    handleSendDriversNotif,
    registerForPushNotifications
};