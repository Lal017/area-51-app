import * as FileSystem from 'expo-file-system';
import { updateUser } from '../src/graphql/mutations';
import { reverseGeocodeAsync } from 'expo-location';
import { uploadData, list, getUrl, remove } from 'aws-amplify/storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { post } from 'aws-amplify/api';
import { v4 as uuidv4 } from 'uuid';

// --------------------------------------------------------
//              ADD USER TO TOWDRIVERS GROUP
// --------------------------------------------------------

// used to invoke lambda to add user to TowDrivers group
const handleMakeUserTowDriver = async (username) =>
{
    try {
        const restOperation = post({
            apiName: 'area51RestApi',
            path: '/addUserToTowDriversGroup',
            options: {
                body: {
                    username: username
                }
            }
        });

        const { body } = await restOperation.response;
        const str = await body.json();

        return str;
    } catch (error) {
        console.error('ERROR, could not make user a tow driver:', error);
    }
};

const handleAssignTowDriverId = async (client, userId) =>
{
    try {
        const driverId = uuidv4();

        await client.graphql({
            query: updateUser,
            variables: {
                input: {
                    id: userId,
                    driverId: driverId,
                    access: 'TowDrivers'
                }
            }
        });
    } catch (error) {
        console.error('ERROR, could not assign tow driver Id:', error);
    }
};


// --------------------------------------------
//              HOME PAGE IMAGES
// --------------------------------------------

// get all images in storage
const handleListHomeImages = async () =>
{
    try {
        const result = await list({
            path: 'public/homeImages/'
        });

        return result.items;
    } catch (error) {
        console.error('ERROR, could not get home images:', error);
    }
};

// get urls for all home page images in storage
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
        console.error('ERROR, could not get URLs for home images:', error);
    }
};

// upload image to home page
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
        console.error('ERROR, could not upload home image:', error);
    }
};

// remove image from home page
const handleRemoveHomeImage = async (url) =>
{
    const path = extractPath(url);

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
        console.error('ERROR, could not remove home image:', error);
    }
};


// -------------------------------------------
//          ESTIMATES AND INVOICES
// -------------------------------------------

// used to upload an invoice to a customers storage
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
        console.error('ERROR, could not upload invoice:', error);
    }
};

// used to list all invoices from a customers storage
const handleListInvoices = async (identityId) =>
{
    try {
        const result = await list({
            path: `protected/${identityId}/invoices`
        });

        return result.items;
    } catch (error) {
        console.error('ERROR, could not get invoices:', error);
    }
};

// used to upload an estimate to a customers storage
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
        console.error('ERROR, could not upload estimate:', error);
    }
};

// used to list all estimates from a customers storage
const handleListEstimates = async (identityId) =>
{
    try {
        const result = await list({
            path: `protected/${identityId}/estimates`
        });

        return result.items;
    } catch (error) {
        console.error('ERROR, could not get estimates:', error);
    }
};

// used to get the url for invoices and estimates in storage
const handleGetUrl = async (pdfPath) =>
{
    try {
        const { url } = await getUrl({
            path: pdfPath
        });
        return url.toString();
    } catch (error) {
        console.error('ERROR, could not get URL:', error);
    }
};


// ------------------------------------------
//                 LOCATION
// ------------------------------------------

// used to get the approximate address using coordinates
const handleGetAddress = async (latitude, longitude) =>
{
    try {
        const addressArray = await reverseGeocodeAsync({latitude, longitude});

        if (addressArray.length > 0) {
            const address = addressArray[0];
            return `${address.name}, ${address.street}, ${address.city}, ${address.region}, ${address.postalCode}`;
        }
    } catch (error) {
        console.error('ERROR, could not get address:', error);
    }
};


// -------------------------------------
//              DO NOT EDIT
// -------------------------------------

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
        console.error('ERROR, could not convert to blob:', error);
        throw error;
    }
};

const extractPath = (url) => {
    const match = url.match(/\/(public\/.+?\.(jpg|jpeg|png|webp|heic))/i);
    if (match && match[1]) {
        return match[1];
    }
    throw new Error('could not extract path');
};

export {
    handleMakeUserTowDriver,
    handleAssignTowDriverId,
    handleListHomeImages,
    handleGetURLs,
    handleUploadHomeImage,
    handleRemoveHomeImage,
    handleUploadInvoice,
    handleListInvoices,
    handleUploadEstimate,
    handleListEstimates,
    handleGetUrl,
    handleGetAddress
}