import { createAppointment, createTowRequest, deleteAppointment, deleteTowRequest, updateAppointment, updateTowRequest } from '../src/graphql/mutations';
import { post, get } from 'aws-amplify/api';
import { Alert } from 'react-native';
import { appointmentsByUserId, towRequestsByUserId } from '../src/graphql/queries';
import { router } from 'expo-router';

// get all appointments from ALL users
const handleGetAppointments = async () =>
{
    try {
        const today = new Date().toLocaleDateString('sv-SE');

        const restOperation = post({
            apiName: 'area51RestApi',
            path: '/getAppointments',
            authMode: 'AWS_IAM',
            options: {
                body: {
                    date: today
                }
            }
        });

        const { body } = await restOperation.response;
        const str = await body.json();

        return str;
    } catch (error) {
        console.log('Error getting appointments', error);
    }
};

const handleSetTimes = async (appointments, day) =>
{
    const TIME_SLOTS = [ '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00' ];

    const filteredSlots = TIME_SLOTS.filter(slot => {
        return !appointments.some(
            appointment => appointment.date === day && appointment.time === slot
        )
    });

    return filteredSlots;
};

const handleFinalCheck = async (date, time) =>
{
    const appointments = await handleGetAppointments();
    return appointments.some(appointment => appointment.date === date && appointment.time === time);
};

const handleCreateAppointment = async (client, date, time, service, notes, userId, vehicleId, setAppointment) =>
{
    try {
        await client.graphql({
            query: createAppointment,
            variables: {
                input: {
                    date: date,
                    time: time,
                    service: service,
                    notes: notes,
                    userId: userId,
                    vehicleId: vehicleId,
                }
            }
        });
        
        const getAppointments = await handleGetMyAppointments(client, userId);
        setAppointment(getAppointments);
        Alert.alert(
            'Appointment created',
            'Your appointment has been scheduled!',
            [{ text: 'OK' }]
        );
    } catch (error) {
        console.log('Error creating appointment', error);
    }
};

const handleUpdateAppointment = async (client, appointmentId, date, time, service, notes, userId, vehicleId, setAppointments) =>
{
    try {
        await client.graphql({
            query: updateAppointment,
            variables: {
                input: {
                    id: appointmentId,
                    date: date,
                    time: time,
                    service: service,
                    notes: notes,
                    userId: userId,
                    vehicleId: vehicleId
                }
            }
        });

        const getAppointments = await handleGetMyAppointments(client, userId);
        setAppointments(getAppointments);
        
        Alert.alert(
            'Appointment updated',
            'Your appointment has been updated!',
            [{ text: 'OK' }]
        )
    } catch (error) {
        console.log('Error updating appointment:', error);
    }
};

const handleDeleteAppointment = async (client, appointmentId, userId, setAppointments) =>
{
    try {
        await client.graphql({
            query: deleteAppointment,
            variables: {
                input: {
                    id: appointmentId
                }
            }
        });

        const getAppointments = await handleGetMyAppointments(client, userId);
        setAppointments(getAppointments);

        Alert.alert(
            'Appointment cancelled',
            'Your appointment has been cancelled',
            [{ text: 'OK' }]
        );
    } catch (error) {
        console.log('Error deleting appointment:', error);
    }
};

// get all appointments from logged in user
const handleGetMyAppointments = async (client, userId) =>
{
    try {
        const today = new Date().toLocaleDateString('en-CA');

        const appointments = await client.graphql({
            query: appointmentsByUserId,
            variables: {
                userId: userId,
                filter: {
                    date: { ge: today }
                }
            }
        });

        return appointments.data.appointmentsByUserId.items;
    } catch (error) {
        console.log('Error getting appointments', error);
    }
}

// get all active Tow Requests
const handleGetAllTowRequests = async () =>
{
    try {
        const restOperation = get({
            apiName: 'area51RestApi',
            path: '/getTowRequests',
            authMode: 'AWS_IAM'
        });

        const { body } = await restOperation.response;
        const str = await body.json();

        return str;
    } catch (error) {
        console.log('Error getting ALL tow requests:', error);
    }
};

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
        console.log('Error creating tow request: ', error);
    }
};

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
        console.log('Error getting tow request:', error);
    }
};

// used to update the tow request after receiving a notification
const handleNotifUpdateTowRequest = async (client, userId, setTowRequest) =>
{
    if (!client || !userId) return;

    try {
        const update = await handleGetTowRequest(client, userId);
        setTowRequest(update);
    } catch (error) {
        console.log('Error updating tow request:', error);
    }
};

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
        console.log('Error updating tow request:', error);
    }
};

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
        console.log('All tow requests deleted successfully');
    } catch (error) {
        console.log('Error deleting all tow requests:', error);
    }
}

const handleDeleteAllAppointments = async (client, userId) =>
{
    try {
        const result = await client.graphql({
            query: appointmentsByUserId,
            variables: {
                userId: userId
            }
        });

        const appointments = result.data.appointmentsByUserId.items;

        for (const appointment of appointments) {
            await client.graphql({
                query: deleteAppointment,
                variables: {
                    input: {
                        id: appointment.id
                    }
                }
            });
        }

        console.log('All appointments deleted successfully');
    } catch (error) {
        console.log('Error deleting all appointments:', error);
    }
};

export {
    handleGetAppointments,
    handleSetTimes,
    handleCreateAppointment,
    handleUpdateAppointment,
    handleFinalCheck,
    handleDeleteAppointment,
    handleDeleteAllAppointments,
    handleGetMyAppointments,
    handleGetAllTowRequests,
    handleCreateTowRequest,
    handleGetTowRequest,
    handleNotifUpdateTowRequest,
    handleUpdateTowRequestStatus,
    handleDeleteAllTowRequests
}