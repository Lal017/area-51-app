import { createAppointment } from '../src/graphql/mutations';

const handleCreateAppointment = async (client, date, time, service, notes, vehicleId) =>
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
                    vehicle: vehicleId
                }
            }
        })
    } catch (error) {
        console.log('Error creating appointment', error);
    }
};

export {
    handleCreateAppointment,
}