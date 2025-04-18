import { Alert } from 'react-native';
import { createPushToken, updatePushToken, deletePushToken } from '../src/graphql/mutations';
import { listPushTokens, getPushToken } from '../src/graphql/queries';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Expo notif functions
const sendPushNotification = async (expoPushToken, notif_title, notif_body) =>
{
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: notif_title,
        body: notif_body
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

const handleRegistrationError = (errMessage) =>
{
    Alert.alert(
        'Registration Error',
        errMessage,
        [
            { text: 'OK' }
        ]
    );
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

// Amplify notif functions
const handleCreatePushToken = async (client, user_id, token, user_access, name, email, phoneNumber) =>
{
    try {
        const access_result = user_access.includes('Admins') ? 'Admins' : 'Customers';

        await client.graphql({
            query: createPushToken,
            variables: {
                input: {
                    id: user_id,
                    pushToken: token,
                    access: access_result,
                    name: name,
                    email: email,
                    phone: phoneNumber
                } }
        });
        console.log('token created');
    } catch (error) {
        console.log('CREATE ERROR:', error);
    }
};

const handleUpdatePushToken = async (client, user_id, token, user_access, name, email, phone_number) =>
{
    try {
        const access_result = user_access.includes('Admins') ? 'Admins' : 'Customers';

        await client.graphql({
            query: updatePushToken,
            variables: {
                input: {
                    id: user_id,
                    pushToken: token,
                    access: access_result,
                    name: name,
                    email: email,
                    phone: phone_number
                }
            }
        });
        console.log('token updated');
    } catch (error) {
        console.log('UPDATE ERROR:', error);
    }
};

// used to delete the clients push token when they delete there account
const handleDeletePushToken = async (client, user_id) =>
{
    try {
        await client.graphql({
            query: deletePushToken,
            variables: {
                input: {
                    id: user_id
                }
            }
        });
    } catch (error) {
        console.log('DELETE ERROR:', error);
    }
};

// cleanup unregistered devices in the database
const handleCleanupPushTokens = async () =>
{
    // code here
};

// Debuggin purposes
const handleListPushToken = async (client) =>
{
    try {
        await client.graphql({ query: listPushTokens });
    } catch (error) {
        console.error('LIST ERROR:', error);
    }
};

const findEntry = async (client, user_email) =>
{
    try {
        const result = await client.graphql({
            query: getPushToken,
            variables: {
                email: user_email
            }
        });

        console.log('RESULT:', result);
    } catch (error) {
        console.log('FIND ERROR:', error);
    }
};

export {
    registerForPushNotifications,
    sendPushNotification,
    handleCreatePushToken,
    handleUpdatePushToken,
    handleDeletePushToken,
    handleListPushToken,
    findEntry
};