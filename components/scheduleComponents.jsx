import { createAppointment } from '../src/graphql/mutations';
import { post } from 'aws-amplify/api';
import { Alert } from 'react-native';

const handleGetAppointments = async () =>
{
    try {
        const today = new Date().toLocaleDateString('sv-SE');

        console.log(today);

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

        console.log(str);
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

    console.log('Available time slots:', filteredSlots);
    return filteredSlots;
};

const handleCreateAppointment = async (client, date, time, service, notes, userId, vehicleId) =>
{
    console.log('Creating appointment...', date, time, service, notes, vehicleId);
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
                    onPress: () => console.log('Appointment created successfully!')
                }
            ]
        );
    } catch (error) {
        console.log('Error creating appointment', error);
    }
};

export {
    handleGetAppointments,
    handleSetDay,
    handleCreateAppointment,
}