import { listUsers, getUser } from "../src/graphql/queries";
import { createUser, updateUser, deleteUser } from "../src/graphql/mutations";
import { list, remove } from 'aws-amplify/storage';

// -----------------------------------------------------
//                 USED BY ALL GROUPS
// -----------------------------------------------------

// used to get user data from database
const handleGetUser = async (client, userId) =>
{
    try {
        const result = await client.graphql({
            query: getUser,
            variables: {
                id: userId
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);
        else return result.data.getUser;
    } catch (error) {
        console.error('handleGetUser ERROR:', error);
        throw error;
    }
};

// used to create database entry for user data model
const handleCreateUser = async (client, user_id, identityId, token, access, firstName, lastName, email, phoneNumber, towDriverRequest) =>
{
    try {
        const input = {
            id: user_id,
            identityId: identityId,
            pushToken: token,
            access: access,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phoneNumber
        };

        // set driverId to 1 to show the admin that they are requesting to become a towDriver.
        if (towDriverRequest) { input.driverId = '1' }

        const result = await client.graphql({
            query: createUser,
            variables: { input }
        });

        if (result.errors) throw new Error(result.errors[0].message);
    } catch (error) {
        console.error('handleCreateUser ERROR:', error);
        throw error;
    }
};

// used to update database entry for user data model
const handleUpdateUser = async (client, userId, identityId, pushToken, access, firstName, lastName, email, phone_number, towDriverRequest) =>
{
    try {
        const input = {
            id: userId,
            identityId: identityId,
            pushToken: pushToken,
            access: access,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone_number
        };

        if (towDriverRequest !== undefined) { input.driverId = 1 }

        const result = await client.graphql({
            query: updateUser,
            variables: { input }
        });

        if (result.errors) throw new Error(result.errors[0].message);
    } catch (error) {
        console.error('handleUpdateUser ERROR:', error);
        throw error;
    }
};

// used to delete the clients database entry when they delete their account
const handleDeleteUser = async (client, userId) =>
{
    try {
        const result = await client.graphql({
            query: deleteUser,
            variables: {
                input: {
                    id: userId
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);
    } catch (error) {
        console.error('handleDeleteUser ERROR:', error.errors);
        throw error;
    }
};

// deletes all items in storage
const handleDeleteStorage = async (identityId) =>
{
    try {
        const files = await list({
            path: `protected/${identityId}/`,
        });

        await Promise.all(
            files.items.map((file) =>
                remove({ path: file.path})
            )
        );

    } catch (error) {
        console.error('handleDeleteStorage ERROR:', error);
        throw error;
    }
};


// ----------------------------------
//              ADMINS
// ----------------------------------

// used to list all users in database
const handleListUsers = async (client) =>
{
    try {
        const result = await client.graphql({
            query: listUsers,
            variables: {
                filter: {
                    or : [
                        { access: { eq: 'Customers' }},
                        { access: { eq: 'TowDrivers' }},
                    ]
                }
            }
        });

        // check for errors and throw
        if (result.errors) throw new Error(result.errors[0].message);
        else return result.data.listUsers.items;
    } catch (error) {
        console.error('handleListUsers ERROR:', error);
        throw error;
    }
};

// used to list all customers in database
const handleListCustomers = async (client) =>
{
    try {
        const result = await client.graphql({
            query: listUsers,
            variables: {
                filter: { access: { eq: 'Customers' }}
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);
        else return result.data.listUsers.items;
    } catch (error) {
        console.error('handleListCustomers ERROR:', error);
        throw error;
    }
};


// -------------------------------------------
//                  CUSTOMERS
// -------------------------------------------

// used to request a tow driver account while already authenticated as a customer
const handleRequestDriverAccount = async (client, userId) =>
{
    try {
        const result = await client.graphql({
            query: updateUser,
            variables: {
                input: {
                    id: userId,
                    driverId: '1'
                }
            }
        });

        if (result.errors) throw new Error(result.errors[0].message);
    } catch (error) {
        console.error('handleRequestDriverAccount ERROR:', error);
        throw error;
    }
};

export {
    handleGetUser,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleDeleteStorage,
    handleListUsers,
    handleListCustomers,
    handleRequestDriverAccount
}