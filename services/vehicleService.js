import { listVehicles, vehiclesByUserId } from '../src/graphql/queries';
import { createVehicle, updateVehicle, deleteVehicle } from '../src/graphql/mutations';

// --------------------------------------------
//                  ADMINS
// --------------------------------------------

// used to list all vehicles in database
const handleListVehicles = async (client) =>
{
    try {
        const result = await client.graphql({
            query: listVehicles
        });

        if (result.errors) throw new Error(result.errors[0].message);
        else return result.data.listVehicles.items;
    } catch (error) {
        console.error('handleListVehicles ERROR:', error);
        throw error;
    }
};

// used to update vehicle pickup status
const handleUpdateVehiclePickupStatus = async (client, vehicleId, status) =>
{
    try {
        const result = await client.graphql({
            query: updateVehicle,
            variables: {
                input: {
                    id: vehicleId,
                    readyForPickup: status
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);
    } catch (error) {
        console.error('handleUpdateVehiclePickupStatus ERROR:', error);
        throw error;
    }
};


// --------------------------------------------
//                  CUSTOMERS
// --------------------------------------------

// used to create vehicle entry in database
const handleCreateVehicle = async (client, vehicle, userId, setVehicles) =>
{
    try {
        const result = await client.graphql({
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

        if (result.errors) throw new Error(result.errors[0].message);

        const newVehicle = await client.graphql({ query: listVehicles });
        if (newVehicle.errors) throw new Error(newVehicle.errors[0].message);
        else setVehicles(newVehicle.data.listVehicles.items);
    } catch (error) {
        console.error('handleCreateVehicle ERROR:', error);
        throw error;
    }
};

// used to update vehicle entry in database
const handleUpdateVehicle = async (client, vehicle, vehicleId, userId, setVehicles) =>
{
    try {
        const result = await client.graphql({
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

        if (result.errors) throw new Error(result.errors[0].message);

        const newVehicles = await client.graphql({ query: listVehicles });
        if (newVehicles.errors) throw new Error(newVehicles.errors[0].message);
        else setVehicles(newVehicles.data.listVehicles.items);
    } catch (error) {
        console.error('handleUpdateVehicle ERROR:', error);
        throw error;
    }
};

// used to get all vehicles owned by a user
const handleGetVehicles = async (client, userId) =>
{
    try {
        // get vehicles info from database
        const result = await client.graphql({
            query: vehiclesByUserId,
            variables: {
                userId: userId,
            }
        });
        
        if (result.errors) throw new Error(result.errors[0].message);
        else return result.data.vehiclesByUserId.items;
    } catch (error) {
        console.error('handleGetVehicles ERROR:', error);
        throw error;
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
        console.error('handleNotifUpdateVehicle:', error);
        throw error;
    }
};

// used to update vehicle status in database once the vehicle has been picked up
const handleUpdateVehiclePickup = async (client, vehicleId, userId, setVehicles) =>
{
    try {
        const result = await client.graphql({
            query: updateVehicle,
            variables: {
                input: {
                    id: vehicleId,
                    readyForPickup: false
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);

        const getVehicles = await handleGetVehicles(client, userId);
        if (getVehicles.errors) throw new Error(getVehicles.errors[0].message);
        else setVehicles(getVehicles);
    } catch (error) {
        console.error('handleUpdateVehiclePickup ERROR:', error);
        throw error;
    }
};

// used to delete vehicle if user chooses to remove it
const handleDeleteVehicle = async (client, vehicleId, setVehicles) =>
{
    try {
        const result = await client.graphql({
            query: deleteVehicle,
            variables: {
                input: {
                    id: vehicleId
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);

        const newVehicles = await client.graphql({ query: listVehicles });
        if (newVehicles.errors) throw new Error(newVehicles.errors[0].message);
        else setVehicles(newVehicles.data.listVehicles.items);
    } catch (error) {
        console.error('handleDeleteVehicle ERROR:', error);
        throw error;
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

        if (result.errors) throw new Error(result.errors[0].message);

        const vehicles = result.data.vehiclesByUserId.items;

        await Promise.all(vehicles.map(async (vehicle) => {
            const result = await client.graphql({
                query: deleteVehicle,
                variables: {
                    input: {
                        id: vehicle.id
                    }
                }
            });
            if (result.errors) throw new Error(result.errors[0].message);
        }));
    } catch (error) {
        console.error('handleDeleteAllVehicles ERROR:', error);
        throw error;
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