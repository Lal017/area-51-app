import { listVehicles, vehiclesByUserId } from '../src/graphql/queries';
import { createVehicle, updateVehicle, deleteVehicle } from '../src/graphql/mutations';
import { Alert } from 'react-native';

// --------------------------------------------
//                  ADMINS
// --------------------------------------------

// used to list all vehicles in database
const handleListVehicles = async (client) =>
{
    try {
        const vehicles = await client.graphql({
            query: listVehicles
        });

        return vehicles.data.listVehicles.items;
    } catch (error) {
        console.error('ERROR, could not get vehicles from database:', error);
    }
};

// used to update vehicle pickup status
const handleUpdateVehiclePickupStatus = async (client, vehicleId, status) =>
{
    try {
        await client.graphql({
            query: updateVehicle,
            variables: {
                input: {
                    id: vehicleId,
                    readyForPickup: status
                }
            }
        });
    } catch (error) {
        console.error('ERROR, could not update vehicle status:', error);
    }
};


// --------------------------------------------
//                  CUSTOMERS
// --------------------------------------------

// used to create vehicle entry in database
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

    } catch (error) {
        console.log(error.errors[0].message);
        return 'Something went wrong, please try again later';
    }
};

// used to update vehicle entry in database
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

    } catch (error) {
        console.error(error.errors[0].message);
        return 'Something went wrong, please try again later';
    }
};

// used to get all vehicles owned by a user
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
        console.error('ERROR, could not get vehicles:', error);
    }
};

// used to update vehicles context after receiving a VEHICLE_PICKUP notification
const handleNotifUpdateVehicle = async (client, userId, setVehicles) =>
{
    if (!client || !userId) return;
    try {
        const getVehicles = await handleGetVehicles(client, userId);
        setVehicles(getVehicles);
    } catch (error) {
        console.error('ERROR, could not update vehicle after receiving notification:', error);
    }
};

// used to update vehicle status in database once the vehicle has been picked up
const handleUpdateVehiclePickup = async (client, vehicleId, userId, setVehicles) =>
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

        const getVehicles = await handleGetVehicles(client, userId);
        setVehicles(getVehicles);
    } catch (error) {
        console.error('ERROR, could not update vehicle status:', error);
    }
};

// used to delete vehicle if user chooses to remove it
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

    } catch (error) {
        console.error(error.errors[0].message);
        return 'Something went wrong, please try again later';
    }
};

// used to delete all vehicles when a user deletes their account
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
    } catch (error) {
        console.error('ERROR, could not delete all vehicles', error);
    }
};


export {
    handleListVehicles,
    handleUpdateVehiclePickupStatus,
    handleCreateVehicle,
    handleUpdateVehicle,
    handleGetVehicles,
    handleNotifUpdateVehicle,
    handleUpdateVehiclePickup,
    handleDeleteVehicle,
    handleDeleteAllVehicles
};