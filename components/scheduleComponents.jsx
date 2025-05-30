import { createAppointment, createTowRequest, deleteAppointment, updateAppointment, updateTowRequest } from '../src/graphql/mutations';
import { post } from 'aws-amplify/api';
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

const handleCreateAppointment = async (client, date, time, service, notes, userId, vehicleId) =>
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
        
        Alert.alert(
            'Appointment created successfully!',
            'Your appointment has been scheduled.',
            [{ text: 'OK' }]
        );
    } catch (error) {
        console.log('Error creating appointment', error);
    }
};

const handleUpdateAppointment = async (client, appointmentId, date, time, service, notes, userId, vehicleId) =>
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

        Alert.alert(
            'Appointment updated!',
            'Your appointment has been rescheduled',
            [{ text: 'OK' }]
        )
    } catch (error) {
        console.log('Error updating appointment:', error);
    }
};

const handleDeleteAppointment = async (client, appointmentId) =>
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

        router.replace('/(tabs)');
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
        const today = new Date().toISOString().split('T')[0];

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

const handleCreateTowRequest = async (client, userId, vehicleId, location, notes, setTowRequest) =>
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
                    notes: notes
                }
            }
        });

        await setTowRequest(result.data.createTowRequest);

        router.replace('/(tabs)/(service)/towStatus');
        Alert.alert(
            'Success',
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

        console.log('Tow request:', request.data.towRequestsByUserId.items);
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
},

handleUpdateTowRequestStatus = async (client, towId, status, setTowRequest) =>
{
    try {
        const update = await client.graphql({
            query: updateTowRequest,
            variables: {
                input: {
                    id: towId,
                    status: status
                }
            }
        });
        
        console.log('finishing update...');
    } catch (error) {
        console.log('Error updating tow request:', error);
    }
};

export {
    handleGetAppointments,
    handleSetTimes,
    handleCreateAppointment,
    handleUpdateAppointment,
    handleDeleteAppointment,
    handleGetMyAppointments,
    handleCreateTowRequest,
    handleGetTowRequest,
    handleNotifUpdateTowRequest,
    handleUpdateTowRequestStatus
}