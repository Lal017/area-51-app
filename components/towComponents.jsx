import { listTowRequests, towRequestsByUserId } from "../src/graphql/queries";
import { createTowRequest, updateTowRequest, deleteTowRequest } from "../src/graphql/mutations";
import { Alert } from 'react-native';
import { router } from "expo-router";

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
                        { status: { ne: 'CANCELLED' }},
                        { status: { ne: 'IN_PROGRESS' }}
                    ]
                }
            }
        });

        return result.data.listTowRequests.items;
    } catch (error) {
        console.error('ERROR, could not get all tow requests:', error);
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
        status: status
    };

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
        console.error('ERROR, could not update tow request:', error);
    }
};


// -----------------------------------------
//               TOW DRIVERS
// -----------------------------------------

// used to update tow request with drivers info
const handleAcceptTowRequest = async (client, requestId, status, waitTime, firstName, phone) =>
{
    try {
        await client.graphql({
            query: updateTowRequest,
            variables: {
                input: {
                    id: requestId,
                    status: status,
                    waitTime: waitTime,
                    firstName: firstName,
                    phone: phone
                }
            }
        });
    } catch (error) {
        console.error('ERROR, could not accept tow request:', error);
    }
};

// used to update the drivers location every 30 seconds
const handleUpdateDriversLocation = () =>
{
    try {

        console.log('Current location:');
    } catch (error) {
        console.error('ERROR, could not update drivers location', error);
    }
};


// -------------------------------------
//              CUSTOMERS
// -------------------------------------

// used to create a tow request
const handleCreateTowRequest = async (client, userId, vehicleId, location, requestInfo, setTowRequest) =>
{
    try {
        const result = await client.graphql({
            query: createTowRequest,
            variables: {
                input: {
                    userId: userId,
                    vehicleId: vehicleId,
                    status: "REQUESTED",
                    latitude: location.latitude,
                    longitude: location.longitude,
                    notes: requestInfo.notes,
                    canRun: requestInfo.canRun,
                    canRoll: requestInfo.canRoll,
                    keyIncluded: requestInfo.keyIncluded,
                    isObstructed: requestInfo.isObstructed
                }
            }
        });

        await setTowRequest(result.data.createTowRequest);

        router.replace('towStatus');
        Alert.alert(
            'Tow Request',
            'Your tow request has been sent!',
            [{ text: 'OK' }]
        );
    } catch (error) {
        console.error('ERROR, could not create tow request: ', error);
    }
};

// Used to get any active tow requests
const handleGetTowRequest = async (client, id) =>
{
    try {
        const request = await client.graphql({
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

        return request.data.towRequestsByUserId.items[0];
    } catch (error) {
        console.error('ERROR, could not get tow request:', error);
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
        console.error('ERROR, could not update tow request after receiving notification:', error);
    }
};

// used to update the status of the tow request
const handleUpdateTowRequestStatus = async (client, towId, userId, status, setTowRequest) =>
{
    try {
        await client.graphql({
            query: updateTowRequest,
            variables: {
                input: {
                    id: towId,
                    status: status
                }
            }
        });
        
        const getRequest = await handleGetTowRequest(client, userId);
        setTowRequest(getRequest);
    } catch (error) {
        console.error('ERROR, could not update tow request:', error);
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

        const requests = result.data.towRequestsByUserId.items;

        for (const request of requests) {
            await client.graphql({
                query: deleteTowRequest,
                variables: {
                    input: {
                        id: request.id
                    }
                }
            });
        }
    } catch (error) {
        console.error('ERROR, could not delete all tow requests:', error);
    }
};

export {
    handleGetAllTowRequests,
    handleUpdateCustomersTowRequestStatus,
    handleAcceptTowRequest,
    handleUpdateDriversLocation,
    handleCreateTowRequest,
    handleGetTowRequest,
    handleNotifUpdateTowRequest,
    handleUpdateTowRequestStatus,
    handleDeleteAllTowRequests
}