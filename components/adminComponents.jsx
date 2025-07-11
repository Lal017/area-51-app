import { listUsers, listVehicles } from '../src/graphql/queries';
import { updateTowRequest, updateVehicle } from '../src/graphql/mutations';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { reverseGeocodeAsync } from 'expo-location';
import { uploadData, list, getUrl, remove } from 'aws-amplify/storage';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

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

const sendMassPushNotification = async (title, body, client) =>
{
    try {
        const users = await handleListUsers(client);
        const expoPushTokens = users.map(user => user.pushToken);

        const message = {
        to: expoPushTokens,
        sound: 'default',
        title: title,
        body: body
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

const handleListVehicles = async (client) =>
{
    try {
        const vehicles = await client.graphql({
            query: listVehicles
        });

        return vehicles.data.listVehicles.items;
    } catch (error) {
        console.log('Error fetching vehicles:', error);
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
    let price;
    if (priceParam) { price = '$ ' + priceParam; }

    let input = {
        id: towId,
        status: status
    }

    if (priceParam !== undefined) { input.price = price; }
    if (waitTime !== undefined) { input.waitTime = waitTime; }

    try {
        await client.graphql({
            query: updateTowRequest,
            variables: { input }
        });

        if (status !== 'COMPLETED') {
            Alert.alert(
                'Sent',
                'Customer request has been updated',
                [
                    { text: 'OK' }
                ]
            );
        }
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
};

/* ---------------------------------------------------------------------- */

const handleUploadHomeImage = async (file, fileType) =>
{
    try {
        const fileData = await uriToUint8Array(file, fileType);
        const listImages = await handleListHomeImages();
        const count = listImages?.length ?? 0;

        await uploadData({
            path: `public/homeImages/homeImg${count}.${fileType}`,
            data: fileData
        }).result;

        Alert.alert(
            'Upload Complete',
            'Your image has been uploaded to the home page',
            [
                { text: 'OK' }
            ]
        );
        router.replace('(admin)/homeSettings');
    } catch (error) {
        console.log('Error uploading image:', error);
    }
};

const handleListHomeImages = async () =>
{
    try {
        const result = await list({
            path: 'public/homeImages/'
        });

        return result.items;
    } catch (error) {
        console.log('Error getting images:', error);
    }
};

const uriToUint8Array = async (uri) =>
{
    try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return bytes;
    } catch (error) {
        console.log('Error converting to blob:', error);
        throw error;
    }
};

const handleGetURLs = async () =>
{
    try {
        const items = await handleListHomeImages();
        const urls = await Promise.all(
            items?.map(async (item) => {
                const { url } = await getUrl({ path: item.path });
                return { url: url.toString() };
            })
        );

        return urls;
    } catch (error) {
        console.log('Error getting URL:', error);
    }
};

const extractPath = (url) => {
    const match = url.match(/\/(public\/.+?\.(jpg|jpeg|png|webp|heic))/i);
    if (match && match[1]) {
        return match[1];
    }
    throw new Error('could not extract path');
}

const handleRemoveImage = async (url) =>
{
    const path = extractPath(url);
    console.log(path);
    try {
        await remove({
            path: path
        });

        Alert.alert(
            'Image Removed',
            'The image has been removed from the home page',
            [{ text: 'OK' }]
        );
        router.replace('(admin)/homeSettings');
    } catch (error) {
        console.log('Error removing image:', error);
    }
};

/* ------------------------------------------------------- */

const handleUploadInvoice = async (identityId, file, name) =>
{
    try {
        const fileData = await uriToUint8Array(file, '.pdf');

        await uploadData({
            path: `protected/${identityId}/invoices/${name}`,
            data: fileData,
            options: {
                metadata: {
                    'content-disposition': 'inline',
                },
                contentType: 'application/pdf'
            }
        }).result;

        Alert.alert(
            'Invoice Upload',
            'Invoice has been uploaded to customer account',
            [{ text: 'OK' }]
        );
    } catch (error) {
        console.log('Error uploading document:', error);
    }
};

const handleListInvoices = async (identityId) =>
{
    try {
        const result = await list({
            path: `protected/${identityId}/invoices`
        });

        return result.items;
    } catch (error) {
        console.log('Error getting images:', error);
    }
};

const handleGetUrl = async (pdfPath) =>
{
    try {
        const { url } = await getUrl({
            path: pdfPath
        });
        return url.toString();
    } catch (error) {
        console.log('Error getting URL:', error);
    }
};

const handleUploadEstimate = async (identityId, file, name) =>
{
    try {
        const fileData = await uriToUint8Array(file, '.pdf');

        await uploadData({
            path: `protected/${identityId}/estimates/${name}`,
            data: fileData,
            options: {
                metadata: {
                    'content-disposition': 'inline',
                },
                contentType: 'application/pdf'
            }
        }).result;

        Alert.alert(
            'Estimate Upload',
            'Estimate has been uploaded to customer account',
            [{ text: 'OK' }]
        );
    } catch (error) {
        console.log('Error uploading document:', error);
    }
};

const handleListEstimates = async (identityId) =>
{
    try {
        const result = await list({
            path: `protected/${identityId}/estimates`
        });

        return result.items;
    } catch (error) {
        console.log('Error getting images:', error);
    }
};

/* ------------------------------------------ */

const handleUpdateVehicleStatus = async (client, vehicleId, status) =>
{
    try {
        await client.graphql({
            query: updateVehicle,
            variables: {
                input: {
                    id: vehicleId,
                    readyForPickup: status
                }
            }
        });

        Alert.alert(
            'Vehicle Status',
            'Customer has been notified about vehicle pickup',
            [{ text: 'OK' }]
        );
    } catch (error) {
        console.log('Error updating vehicle status:', error);
    }
};

export {
    handleListUsers,
    handleListVehicles,
    handleListTowRequestUsers,
    sendPushNotification,
    sendMassPushNotification,
    handleUpdateTowRequest,
    handleGetAddress,
    handleUploadHomeImage,
    handleListHomeImages,
    handleGetURLs,
    handleRemoveImage,
    handleUploadInvoice,
    handleListInvoices,
    handleGetUrl,
    handleUploadEstimate,
    handleListEstimates,
    handleUpdateVehicleStatus
}