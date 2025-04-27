import { router } from 'expo-router';
import { createVehicle } from '../src/graphql/mutations';
import { Alert } from 'react-native';

const handleCreateVehicle = async (client, vehicle, userId) =>
{
    try {
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

        router.replace('loading');

        Alert.alert(
            'Success',
            'Vehicle created successfully',
            [
                { text: 'OK' }
            ]
        );
    } catch (error) {
        console.log('Error creating vehicle', error);
    }
};

export {
    handleCreateVehicle,
};