import { router } from 'expo-router';
import { createVehicle, updateVehicle, deleteVehicle } from '../src/graphql/mutations';
import { listVehicles } from '../src/graphql/queries';
import { Alert } from 'react-native';

const handleCreateVehicle = async (client, vehicle, userId, setVehicles) =>
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
                    userId: userId
                }
            }
        });

        const newVehicle = await client.graphql({ query: listVehicles });
        await setVehicles(newVehicle.data.listVehicles.items);

        router.replace('(profile)/vehicleList');

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

const handleUpdateVehicle = async (client, vehicle, vehicleId, userId, setVehicles) =>
{
    try {
        await client.graphql({
            query: updateVehicle,
            variables: {
                input: {
                    id: vehicleId,
                    year: vehicle.year,
                    make: vehicle.make,
                    model: vehicle.model,
                    color: vehicle.color,
                    plate: vehicle.plate,
                    vin: vehicle.vin,
                    userId: userId
                }
            }
        });

        const newVehicles = await client.graphql({ query: listVehicles });
        setVehicles(newVehicles.data.listVehicles.items);

        router.replace('(profile)/vehicleList');

        Alert.alert(
            'Success',
            'Vehicle updated successfully',
            [
                { text: 'OK' }
            ]
        );
    } catch (error) {
        console.log('Error updating vehicle', error);
    }
};

const handleDeleteVehicle = async (client, vehicleId, setVehicles) =>
{
    try {
        await client.graphql({
            query: deleteVehicle,
            variables: {
                input: {
                    id: vehicleId
                }
            }
        });

        const newVehicles = await client.graphql({ query: listVehicles });
        setVehicles(newVehicles.data.listVehicles.items);

        router.replace('(profile)/vehicleList');

        Alert.alert(
            'Success',
            'Vehicle deleted successfully',
            [
                { text: 'OK' }
            ]
        );
    } catch (error) {
        console.log('Error deleting vehicle', error);
    }
};

export {
    handleCreateVehicle,
    handleUpdateVehicle,
    handleDeleteVehicle
};