import { Alert } from 'react-native';
import { createUser, updateUser, deleteUser } from '../src/graphql/mutations';
import { listUsers, getUser } from '../src/graphql/queries';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Expo notif functions
const sendPushNotifications = async (expoPushToken, title, body, data) =>
{
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: { data }
    };

    console.log(message);

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
        console.log('sent');
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
const handleCreateUser = async (client, user_id, token, user_access, name, email, phoneNumber) =>
{
    try {
        const access_result = user_access.includes('Admins') ? 'Admins' : 'Customers';

        await client.graphql({
            query: createUser,
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

const handleUpdateUser = async (client, user_id, token, user_access, name, email, phone_number) =>
{
    try {
        const access_result = user_access.includes('Admins') ? 'Admins' : 'Customers';

        await client.graphql({
            query: updateUser,
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
const handleDeleteUser = async (client, user_id) =>
{
    try {
        await client.graphql({
            query: deleteUser,
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

// check if user entry already exists
const handleCheckUser = async (client, userId) =>
{
    const exists = await client.graphql({
        query: getUser,
        variables: {
            id: userId
        }
    });

    var alreadyExists;

    if (exists.data.getUser === null) { alreadyExists = false }
    else { alreadyExists = true }

    return alreadyExists;
};

const handleCustomerRequest = async (client, data) =>
{
    try {
        const title = 'Towing Request';
        const body = 'A customer is requesting a towing service';
        const pushTokens = await handleGetAdmins(client);
        await sendPushNotifications(pushTokens, title, body, data);
    } catch (error) {
        console.log('CUSTOMER REQUEST ERROR:', error);
    }
}

// gets push tokens from admins to send a request
const handleGetAdmins = async (client) =>
{
    try {
        const result = await client.graphql({
            query: listUsers,
            variables: {
                filter: {
                    access: {
                        eq: 'Admins'
                    }
                }
            }
        });

        return result.data.listUsers.items.map(item => item.pushToken);
    } catch (error) {
        console.log('GET ADMINS ERROR:', error);
    }
};

export {
    registerForPushNotifications,
    handleCustomerRequest,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleGetAdmins,
    handleCheckUser
};