import { createAppointment, createTowRequest, updateTowRequest } from '../src/graphql/mutations';
import { post } from 'aws-amplify/api';
import { Alert } from 'react-native';
import { appointmentsByUserId, towRequestsByUserId } from '../src/graphql/queries';

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

const handleSetDay = async (appointments, day) =>
{
    const TIME_SLOTS = [
    { time: '09:00 AM', value: '09:00:00' }, { time: '10:00 AM', value: '10:00:00' }, { time: '11:00 AM', value: '11:00:00' }, { time: '12:00 PM', value: '12:00:00' }, { time: '01:00 PM', value: '13:00:00' }, { time: '02:00 PM', value: '14:00:00' }, { time: '03:00 PM', value: '15:00:00' }, { time: '04:00 PM', value: '16:00:00' }];

    const filteredSlots = TIME_SLOTS.filter(slot => {
        return !appointments.some(
            appointment => appointment.date === day && appointment.time === slot.value
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
            [
                {
                    text: 'OK',
                }
            ]
        );
    } catch (error) {
        console.log('Error creating appointment', error);
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

        console.log('APPOINTMENTS', appointments.data.appointmentsByUserId.items);

        return appointments.data.appointmentsByUserId.items;
    } catch (error) {
        console.log('Error getting appointments', error);
    }
}

const handleCreateTowRequest = async (client, userId, vehicleId, location, notes, setTowRequest) =>
{
    try {
        await client.graphql({
            query: createTowRequest,
            variables: {
                input: {
                    userId: userId,
                    vehicleId: vehicleId,
                    status: "REQUESTED",
                    location: location,
                    notes: notes
                }
            }
        });

        const updatedRequest = await handleGetTowRequest(client, userId);
        await setTowRequest(updatedRequest);
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
                    status: { ne: 'COMPLETED'}
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
        console.log('UPDATED!');
    } catch (error) {
        console.log('Error updating tow request:', error);
    }
},

handleUpdateTowRequestReply = async (client, towId, status, setTowRequest) =>
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
        
        setTowRequest(update);
        console.log('Updated!');
    } catch (error) {
        console.log('Error updating tow request:', error);
    }
};

export {
    handleGetAppointments,
    handleSetDay,
    handleCreateAppointment,
    handleGetMyAppointments,
    handleCreateTowRequest,
    handleGetTowRequest,
    handleNotifUpdateTowRequest,
    handleUpdateTowRequestReply
}