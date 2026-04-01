import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { handleListUsers } from './userService'
import { post } from 'aws-amplify/api';

// ------------------------------------
//              ADMINS
// ------------------------------------

// sends a push notification to a specific user
const sendPushNotification = async (expoPushToken, title, body, data) =>
{
    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: expoPushToken,
                sound: 'default',
                title: title,
                body: body,
                data: data
            }),
        });

        if (!response.ok) throw new Error(`Push Notification Failed: ${response.status}`);
    } catch (error) {
        console.error('sendPushNotification ERROR:', error);
        throw error;
    }
};

// used to send a notification to all users
const sendMassPushNotification = async (client, title, body, data) =>
{
    try {
        const users = await handleListUsers(client);
        const expoPushTokens = users
            .filter(user => user.access === 'Customers')
            .map(user => user.pushToken);

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: expoPushTokens,
                sound: 'default',
                title: title,
                body: body,
                data: data
            })
        });

        if (!response.ok) throw new Error(`Mass Push Notification Failed: ${response.status}`)
    } catch (error) {
        console.error('sendMassPushNotification ERROR:', error);
        throw error;
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
            throw new Error('Could not find any admin accounts');
        }
    } catch (error) {
        console.error('handleSendAdminNotif ERROR:', error);
        throw error;
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
            throw new Error('Could not find any tow truck driver accounts');
        }
    } catch (error) {
        console.error('handleSendDriversNotif ERROR:', error);
        throw error;
    }
};

// ------------------------------------------
//              DO NOT EDIT
// ------------------------------------------

const registerForPushNotifications = async () =>
{
    Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#000000',
    });

    if (Device.isDevice) {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                throw new Error('Permission was not granted to get token');
            }
        } catch (error) {
            throw new Error('Could not request notification permissions');
        }
        
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            throw new Error('Project ID not found');
        }
        try {
            const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            return pushTokenString;
        } catch (error) {
            throw error;
        }
    } else {
        throw new Error('Must use physical device for Push Notifications');
    }
};

export {
    sendPushNotification,
    sendMassPushNotification,
    handleSendAdminNotif,
    handleSendDriversNotif,
    registerForPushNotifications
};