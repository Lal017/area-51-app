import { Styles } from '../constants/styles';
import { appointmentsByUserId, listAppointments } from '../src/graphql/queries';
import { createAppointment, deleteAppointment, updateAppointment } from '../src/graphql/mutations';
import { post } from 'aws-amplify/api';
import { FontAwesome5, FontAwesome, Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// -------------------------------------
//              ADMINS
// -------------------------------------

const handleGetAllAppointments = async (client) =>
{
    try {
        const result = await client.graphql({
            query: listAppointments
        });

        if (result.errors) throw new Error(result.errors[0].message);
        else return result.data.listAppointments.items;
    } catch (error) {
        console.error('handleGetAllAppointments ERROR:', error);
        throw error;
    }
};

// -------------------------------------
//              CUSTOMERS
// -------------------------------------

// get all appointments from logged in user
const handleGetMyAppointments = async (client, userId) =>
{
    try {
        const today = new Date().toLocaleDateString('en-CA');

        const result = await client.graphql({
            query: appointmentsByUserId,
            variables: {
                userId: userId,
                filter: {
                    date: { ge: today }
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);
        else return result.data.appointmentsByUserId.items;
    } catch (error) {
        console.error('handleGetMyAppointments ERROR:', error);
        throw error;
    }
};

// get all scheduled appointments.
// used to filter out unavailable time slots
const handleGetAppointments = async () =>
{
    try {
        const today = new Date().toLocaleDateString('sv-SE');

        const restOperation = post({
            apiName: 'area51RestApi',
            path: '/getAppointments',
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
        console.error('handleGetAppointments ERROR:', error);
        throw error;
    }
};

// used to set only the available time slots on the selected day
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

// checks if another customer already has an appointment on this day and time
const handleFinalCheck = async ({date, time}) =>
{
    try {
        const appointments = await handleGetAppointments();
        return appointments.some(appointment =>
            appointment.date === date &&
            appointment.time === time
        );
    } catch (error) {
        console.error('handleFinalCheck ERROR:', error);
        throw error;
    }
};

// used to create an appointment
const handleCreateAppointment = async ({client, date, time, service, notes, userId, vehicle, setAppointments}) =>
{
    try {
        const result = await client.graphql({
            query: createAppointment,
            variables: {
                input: {
                    date: date,
                    time: time,
                    service: service,
                    notes: notes,
                    userId: userId,
                    vehicleId: vehicle.id,
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
        
        const getAppointments = await handleGetMyAppointments(client, userId);
        setAppointments(getAppointments);
        return getAppointments;
    } catch (error) {
        console.error('handleCreateAppointment ERROR:', error);
        throw error;
    }
};

// used to update appointment details
const handleUpdateAppointment = async (client, appointmentId, date, time, service, notes, userId, vehicle, setAppointments) =>
{
    try {
        const result = await client.graphql({
            query: updateAppointment,
            variables: {
                input: {
                    id: appointmentId,
                    date: date,
                    time: time,
                    service: service,
                    notes: notes,
                    userId: userId,
                    vehicleId: vehicle.id,
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

        const getAppointments = await handleGetMyAppointments(client, userId);
        setAppointments(getAppointments);
        
    } catch (error) {
        console.error('handleUpdateAppointment ERROR:', error);
        throw error;
    }
};

// used to delete appointment if customer needs to cancel
const handleDeleteAppointment = async (client, appointmentId, userId, setAppointments) =>
{
    try {
        const result = await client.graphql({
            query: deleteAppointment,
            variables: {
                input: {
                    id: appointmentId
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);

        const getAppointments = await handleGetMyAppointments(client, userId);
        setAppointments(getAppointments);
    } catch (error) {
        console.error('handleDeleteAppointment ERROR:', error);
        throw error;
    }
};

// used to delete all appointments when a user deletes their account
const handleDeleteAllAppointments = async (client, userId) =>
{
    try {
        const result = await client.graphql({
            query: appointmentsByUserId,
            variables: {
                userId: userId
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);

        const appointments = result.data.appointmentsByUserId.items;

        await Promise.all(appointments.map(async (appointment) => {
            const result = await client.graphql({
                query: deleteAppointment,
                variables: { input: { id: appointment.id }}
            });
            if (result.errors) throw new Error(result.errors[0].message);
        }));
    } catch (error) {
        console.error('handleDeleteAllAppointments ERROR:', error);
        throw error;
    }
};

// used to return the correct icon for a selected service
const iconCheck = (service) =>
{
    switch (service) {
        case 'Oil Change':
            return <FontAwesome5 name="oil-can" size={30} style={Styles.icon}/>;
        case 'Diagnosis':
            return <FontAwesome name="stethoscope" size={30} style={Styles.icon}/>;
        case 'Tuning':
            return <Entypo name="area-graph" size={30} style={Styles.icon}/>;
        case 'A/C':
            return <MaterialIcons name="air" size={30} style={Styles.icon}/>;
        case 'Vehicle Pickup':
            return <MaterialCommunityIcons name='car-clock' size={30} style={Styles.icon}/>;
        default:
            return <MaterialCommunityIcons name="dots-horizontal-circle" size={30} style={Styles.icon}/>;
    }
};

export {
    handleGetAllAppointments,
    handleGetAppointments,
    handleSetTimes,
    handleCreateAppointment,
    handleUpdateAppointment,
    handleFinalCheck,
    handleDeleteAppointment,
    handleDeleteAllAppointments,
    handleGetMyAppointments,
    iconCheck
}