import Colors from '../constants/colors';
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

        return result.data.listAppointments.items;
    } catch (error) {
        console.error('ERROR, could not get appointments:', error);
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
        console.error('ERROR, could not get appointments', error);
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
        console.error('ERROR, could not get appointments', error);
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
const handleFinalCheck = async (date, time) =>
{
    const appointments = await handleGetAppointments();
    return appointments.some(appointment => appointment.date === date && appointment.time === time);
};

// used to create an appointment
const handleCreateAppointment = async ({client, date, time, service, notes, userId, vehicle, setAppointments}) =>
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
        
        const getAppointments = await handleGetMyAppointments(client, userId);
        setAppointments(getAppointments);

    } catch (error) {
        console.error('ERROR, could not create appointment', error);
    }
};

// used to update appointment details
const handleUpdateAppointment = async (client, appointmentId, date, time, service, notes, userId, vehicle, setAppointments) =>
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

        const getAppointments = await handleGetMyAppointments(client, userId);
        setAppointments(getAppointments);
        
    } catch (error) {
        console.error('ERROR, could not update appointment:', error);
    }
};

// used to delete appointment if customer needs to cancel
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

    } catch (error) {
        console.error('ERROR, could not delete appointment:', error);
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
    } catch (error) {
        console.error('ERROR, could not delete all appointments:', error);
    }
};

// used to return the correct icon for a selected service
const iconCheck = (service) =>
{
    switch (service) {
        case 'Oil Change':
            return <FontAwesome5 name="oil-can" size={30} style={Styles.icon} color={Colors.backDrop}/>;
        case 'Diagnosis':
            return <FontAwesome name="stethoscope" size={30} style={Styles.icon} color={Colors.backDrop}/>;
        case 'Tuning':
            return <Entypo name="area-graph" size={30} style={Styles.icon} color={Colors.backDrop}/>;
        case 'A/C':
            return <MaterialIcons name="air" size={30} style={Styles.icon} color={Colors.backDrop}/>;
        default:
            return <MaterialCommunityIcons name="dots-horizontal-circle" size={30} style={Styles.icon} color={Colors.backDrop}/>;
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