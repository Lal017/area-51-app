import { createVehicle } from '../src/graphql/mutations';

const handleCreateVehicle = async (client, vehicle, userId) =>
{
    await client.graphql({
        query: createVehicle,
        variables: {
            input: {
                year: vehicle.year,
                make: vehicle.make,
                model: vehicle.model,
                color: vehicle.color,
                plate: vehicle.plate,
                vin: vehicle.vin,
                userVehiclesId: userId
            }
        }
    });
};

const vehicleCheck = async (client) =>
{
    // const user = await client.graphql({ query: getUser });

    const vehicles = [
        { year: '2010', make: 'Scion', model: 'Tc'},
        { year: '2022', make: 'Toyota', model: 'Corolla' }
    ];

    return vehicles;
};

export {
    handleCreateVehicle,
    vehicleCheck
};