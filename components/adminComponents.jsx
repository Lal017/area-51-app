import { listUsers } from '../src/graphql/queries';
import { updateTowRequest } from '../src/graphql/mutations';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { reverseGeocodeAsync } from 'expo-location';

// Expo notif functions
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

const handleListUsers = async (client) =>
{
    try {
        const users = await client.graphql({
            query: listUsers,
            variables: {
                filter: {
                    access: { eq: 'Customers' }
                }
            }
        });

        return users.data.listUsers.items;
    } catch (error) {
        console.log('Error getting users:', error);
    }
};

const handleListTowRequestUsers = async (client, userArr) =>
{
    try {
        const users = await client.graphql({
            query: listUsers,
            variables: {
                filter: {
                    id: { in: userArr }
                }
            }
        });

        return users.data.listUsers.items;
    } catch (error) {
        console.log('Error getting users:', error);
    }
};

const handleUpdateTowRequest = async (client, towId, status, priceParam, waitTime) =>
{
    let price = '$ ' + priceParam;

    try {
        await client.graphql({
            query: updateTowRequest,
            variables: {
                input: {
                    id: towId,
                    status: status,
                    price: price,
                    waitTime: waitTime
                }
            }
        });

        router.replace('/(admin)');
        Alert.alert(
            'Sent',
            'Customer request has been updated',
            [
                { text: 'OK' }
            ]
        );
    } catch (error) {
        console.log('Error updating tow request', error);
    }
};

const handleGetAddress = async (latitude, longitude) =>
{
    try {
        const addressArray = await reverseGeocodeAsync({latitude, longitude});

        if (addressArray.length > 0) {
            const address = addressArray[0];
            return `${address.name}, ${address.street}, ${address.city}, ${address.region}, ${address.postalCode}`;
        }
    } catch (error) {
        console.log('Error getting address:', error);
    }
}

export {
    handleListUsers,
    handleListTowRequestUsers,
    sendPushNotification,
    handleUpdateTowRequest,
    handleGetAddress
}