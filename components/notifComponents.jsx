import { Alert } from 'react-native';
import { createUser, updateUser, deleteUser } from '../src/graphql/mutations';
import { getUser } from '../src/graphql/queries';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

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

const handleCustomerRequest = async (notes, vehicle, customer, setRequest) =>
{
    try {
        const response = await fetch('https://a7ti3pg5r5kuu34bdl3osmwotq0gajtp.lambda-url.us-east-2.on.aws/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Towing Request',
                content: 'A customer has requested a tow',
                data: {
                    notes: notes,
                    vehicle: vehicle,
                    userId: customer.userId,
                    name: customer.name,
                    email: customer.email,
                    phoneNumber: customer.phoneNumber
                }})
        });

        const result = await response.json();

        if (result?.data?.listUsers?.items?.length > 0) {
            console.log('REQUEST SENT SUCCESSFULLY:', result);
            setRequest(true);
        } else {
            console.log('REQUEST FAILED:', result);
        }
    } catch (error) {
        console.log('CUSTOMER REQUEST ERROR:', error);
    }
};

export {
    registerForPushNotifications,
    handleCustomerRequest,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleCheckUser
};