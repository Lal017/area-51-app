import { getTowRequest, listTowRequests, towRequestsByUserId } from "../src/graphql/queries";
import { createTowRequest, updateTowRequest, deleteTowRequest } from "../src/graphql/mutations";
import { LocationClient } from '@aws-sdk/client-location';
import { fetchAuthSession } from 'aws-amplify/auth'
import { router } from "expo-router";
import { post } from 'aws-amplify/api';
import { Magnetometer } from 'expo-sensors';

// ---------------------------------------
//           ADMINS & TOWDRIVERS
// ---------------------------------------

// get all active Tow Requests
const handleGetAllTowRequests = async (client) =>
{
    try {
        const result = await client.graphql({
            query: listTowRequests,
            variables: {
                filter: {
                    and: [
                        { status: { ne: 'COMPLETED' }},
                        { status: { ne: 'CANCELLED' }}
                    ]
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);
        else return result.data.listTowRequests.items;
    } catch (error) {
        console.error('handleGetAllTowRequests ERROR:', error);
        throw error;
    }
};

const handleFinalTowCheck = async (client, towId) =>
{
    try {
        const result = await client.graphql({
            query: getTowRequest,
            variables: {
                id: towId
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);

        if (result.data.getTowRequest.status === 'REQUESTED') {
            return false;
        }
        return true;
    } catch (error) {
        console.error('handleFinalCheck ERROR:', error);
        throw error;
    }
};


// -----------------------------------------
//                  ADMINS
// -----------------------------------------

// used to update the status of a customers tow request
const handleUpdateCustomersTowRequestStatus = async (client, requestId, status, waitTime) =>
{
    let input = {
        id: requestId,
        status: status,
    };

    if (waitTime !== undefined) {
        input.waitTime = waitTime;
        const currentTime = new Date().toISOString();
        input.acceptedAt = currentTime;
    }

    try {
        const result = await client.graphql({
            query: updateTowRequest,
            variables: { input }
        });

        if (result.errors) throw new Error(result.errors[0].message);

        if (status !== 'COMPLETED') {
            // use react native toast to show that customer request has been updated
        }
    } catch (error) {
        console.error('handleUpdateCustomersTowRequestStatus ERROR:', error);
        throw error;
    }
};


// -----------------------------------------
//               TOW DRIVERS
// -----------------------------------------

// used to update tow request with drivers info
const handleAcceptTowRequest = async (client, requestId, status, waitTime, driverId, firstName, phone) =>
{
    try {
        const currentTime = new Date().toISOString();

        const result = await client.graphql({
            query: updateTowRequest,
            variables: {
                input: {
                    id: requestId,
                    status: status,
                    waitTime: waitTime,
                    driverId: driverId,
                    driverFirstName: firstName,
                    driverPhoneNumber: phone,
                    acceptedAt: currentTime
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);
    } catch (error) {
        console.error('handleAcceptTowRequest ERROR:', error);
        throw error;
    }
};

// used to mark the tow request as completed
const handleCompleteTowRequest = async (client, requestId) =>
{
    try {
        const result = await client.graphql({
            query: updateTowRequest,
            variables: {
                input: {
                    id: requestId,
                    status: 'COMPLETED'
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);
    } catch (error) {
        console.error('handleCompleteTowRequest ERROR:', error);
        throw error;
    }
};

const sendDriverLocation = async (driver_id, latitude, longitude) =>
{
    try {
        const response = post({
            apiName: 'area51RestApi',
            path: '/updateTrackerLocation',
            options: {
                body: {
                    driverId: driver_id,
                    latitude,
                    longitude
                }
            }
        });

        const { body } = await response.response;
        const result = await body.json();
        console.log(result);

    } catch (error) {
        console.error('sendDriverLocation ERROR:', error);
        throw error;
    }
};

const getInitialCompassHeading = async () =>
{
    return new Promise((resolve, reject) => {
        const subscription = Magnetometer.addListener(data => {
            const { x, y } = data;
            let angle = Math.atan2(y, x) * (180 / Math.PI); // radians -> degrees
            if (angle < 0) angle += 360
            resolve(angle);
            subscription.remove();
        });

        setTimeout(() => {
            subscription.remove();
            reject(new Error('Failed to get compass heading'));
        }, 2000);
    });
};


// -------------------------------------
//              CUSTOMERS
// -------------------------------------

// used to create a tow request
const handleCreateTowRequest = async (client, userId, vehicle, location, requestInfo, setTowRequest) =>
{
    try {
        const result = await client.graphql({
            query: createTowRequest,
            variables: {
                input: {
                    userId: userId,
                    vehicleId: vehicle.id,
                    status: "REQUESTED",
                    latitude: location.latitude,
                    longitude: location.longitude,
                    notes: requestInfo.notes,
                    canRun: requestInfo.canRun,
                    canRoll: requestInfo.canRoll,
                    keyIncluded: requestInfo.keyIncluded,
                    isObstructed: requestInfo.isObstructed,
                    vehicleYear: vehicle.year,
                    vehicleMake: vehicle.make,
                    vehicleModel: vehicle.model,
                    vehicleColor: vehicle.color,
                    vehiclePlate: vehicle.plate,
                    vehicleVin: vehicle.vin
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);

        setTowRequest(result.data.createTowRequest);
        router.replace('towStatus');
    } catch (error) {
        console.error('handleCreateTowRequest ERROR:', error);
        throw error;
    }
};

// Used to get any active tow requests
const handleGetTowRequest = async (client, id) =>
{
    try {
        const result = await client.graphql({
            query: towRequestsByUserId,
            variables: {
                userId: id,
                filter: {
                    and: [
                        { status: { ne: 'COMPLETED' }},
                        { status: { ne: 'CANCELLED' }}
                    ]
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);
        else return result.data.towRequestsByUserId.items[0];
    } catch (error) {
        console.error('handleGetTowRequest ERROR:', error);
        throw error;
    }
};

// used to update the tow request after receiving a TOW_RESPONSE notification
const handleNotifUpdateTowRequest = async (client, userId, setTowRequest) =>
{
    if (!client || !userId) return;

    try {
        const update = await handleGetTowRequest(client, userId);
        setTowRequest(update);
    } catch (error) {
        console.error('handleNotifUpdateTowRequest', error);
        throw error;
    }
};

// used to update the status of the tow request
const handleUpdateTowRequestStatus = async ({client, towId, userId, status, setTowRequest}) =>
{
    try {
        const result = await client.graphql({
            query: updateTowRequest,
            variables: {
                input: {
                    id: towId,
                    status: status
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);
        
        const getRequest = await handleGetTowRequest(client, userId);
        setTowRequest(getRequest);
    } catch (error) {
        console.error('handleUpdateTowRequestStatus ERROR:', error);
        throw error;
    }
};

// used to delete all tow requests when a user deletes their account
const handleDeleteAllTowRequests = async (client, userID) =>
{
    try {
        const result = await client.graphql({
            query: towRequestsByUserId,
            variables: {
                userId: userID
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);

        const requests = result.data.towRequestsByUserId.items;

        await Promise.all(requests.map(async (request) => {
            const result = await client.graphql({
                query: deleteTowRequest,
                variables: {
                    input: {
                        id: request.id
                    }
                }
            });
            if (result.errors) throw new Error(result.errors[0].message);
        }));
    } catch (error) {
        console.error('handleDeleteAllTowRequests ERROR:', error);
        throw error;
    }
};

const createLocationClient = async () => {
    try {
        const session = await fetchAuthSession();

        return new LocationClient({
            region: "us-east-2",
            credentials: {
                accessKeyId: session.credentials.accessKeyId,
                secretAccessKey: session.credentials.secretAccessKey,
                sessionToken: session.credentials.sessionToken
            }
        });
    } catch (error) {
        console.error('createLocationClient ERROR:', error);
        throw error;
    }
}

export {
    handleGetAllTowRequests,
    handleFinalTowCheck,
    handleUpdateCustomersTowRequestStatus,
    handleAcceptTowRequest,
    handleCompleteTowRequest,
    sendDriverLocation,
    getInitialCompassHeading,
    handleCreateTowRequest,
    handleGetTowRequest,
    handleNotifUpdateTowRequest,
    handleUpdateTowRequestStatus,
    handleDeleteAllTowRequests,
    createLocationClient
}