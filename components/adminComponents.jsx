import { listUsers } from '../src/graphql/queries';
import { updateTowRequest } from '../src/graphql/mutations';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { reverseGeocodeAsync } from 'expo-location';
import { uploadData, list, getUrl, remove } from 'aws-amplify/storage';
import * as FileSystem from 'expo-file-system';

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
};

const handleUploadHomeImage = async ({file, fileType, setPercent}) =>
{
    try {
        const fileData = await uriToUint8Array(file, fileType);
        const listImages = await handleListHomeImages();
        const count = listImages?.length ?? 0;

        await uploadData({
            path: `public/homeImages/homeImg${count}.${fileType}`,
            data: fileData,
            options: {
                onProgress: ({ transferredBytes, totalBytes }) => {
                    if (totalBytes) {
                        const getPercent = Math.round((transferredBytes / totalBytes) * 100);
                        if (transferredBytes === totalBytes) {
                            setPercent(0);
                        } else {
                            setPercent(getPercent);
                        }
                    }
                }
            }
        }).result;

        Alert.alert(
            'Upload Complete',
            'Your image has been uploaded to the home page',
            [{
                text: 'OK',
                onPress: () => router.replace('(admin)')
            }]
        )
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
    const match = url.match(/\/(public\/.+?\.(jpg|jpeg|png|webp|gif))/i);
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

export {
    handleListUsers,
    handleListTowRequestUsers,
    sendPushNotification,
    handleUpdateTowRequest,
    handleGetAddress,
    handleUploadHomeImage,
    handleListHomeImages,
    handleGetURLs,
    handleRemoveImage
}