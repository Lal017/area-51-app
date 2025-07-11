import { createVehicle, updateVehicle, deleteVehicle } from '../src/graphql/mutations';
import { listVehicles, vehiclesByUserId } from '../src/graphql/queries';
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

        Alert.alert(
            'Vehicle Created',
            'Vehicle has been added to your account',
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

        Alert.alert(
            'Vehicle Updated',
            'Vehicle information has been updated',
            [
                { text: 'OK' }
            ]
        );
    } catch (error) {
        console.log('Error updating vehicle', error);
    }
};

const handleGetVehicles = async (client, userId) =>
{
    try {
        // get vehicles info from database
        const vehiclesInfo = await client.graphql({
            query: vehiclesByUserId,
            variables: {
                userId: userId,
            }
        });
        
        return vehiclesInfo.data.vehiclesByUserId.items;
    } catch (error) {
        console.log('Error getting vehicles:', error);
    }
};

// used to update vehicles after receiving a notification
const handleUpdateVehiclePickup = async (client, userId, setVehicles) =>
{
    if (!client || !userId) return;
    try {
        const getVehicles = await handleGetVehicles(client, userId);
        setVehicles(getVehicles);
    } catch (error) {
        console.log('Error updating vehicle pickup:', error);
    }
};

const handleUpdateVehicleStatus = async (client, vehicleId, setVehicles, setVehiclePickup) =>
{
    try {
        await client.graphql({
            query: updateVehicle,
            variables: {
                input: {
                    id: vehicleId,
                    readyForPickup: false
                }
            }
        });

        const newVehicles = await client.graphql({ query: listVehicles });
        setVehicles(newVehicles.data.listVehicles.items);
        const filterVehicles = newVehicles.data.listVehicles.items?.some(item => item.readyForPickup === true);
        setVehiclePickup(filterVehicles);

        Alert.alert(
            'Vehicle Pick Up',
            'Vehicle has been picked up!',
            [
                { text: 'OK' }
            ]
        );
    } catch (error) {
        console.log('Error updating vehicle status:', error);
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

        Alert.alert(
            'Vehicle Deleted',
            'Vehicle has been deleted from your account',
            [
                { text: 'OK' }
            ]
        );
    } catch (error) {
        console.log('Error deleting vehicle', error);
    }
};

const handleDeleteAllVehicles = async (client, userId) =>
{
    try {
        const result = await client.graphql({
            query: vehiclesByUserId,
            variables: {
                userId: userId,
            }
        });

        const vehicles = result.data.vehiclesByUserId.items;

        for (const vehicle of vehicles) {
            await client.graphql({
                query: deleteVehicle,
                variables: {
                    input: {
                        id: vehicle.id
                    }
                }
            });
        }

        console.log('All vehicles deleted successfully');
    } catch (error) {
        console.log('Error deleting all vehicles', error);
    }
};

export {
    handleCreateVehicle,
    handleUpdateVehicle,
    handleGetVehicles,
    handleUpdateVehiclePickup,
    handleUpdateVehicleStatus,
    handleDeleteVehicle,
    handleDeleteAllVehicles
};