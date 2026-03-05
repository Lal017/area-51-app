import { listUsers, getUser } from "../src/graphql/queries";
import { createUser, updateUser, deleteUser } from "../src/graphql/mutations";
import { list, remove } from 'aws-amplify/storage';

// -----------------------------------------------------
//                 USED BY ALL GROUPS
// -----------------------------------------------------

// used to get user data from database
const handleGetUser = async (client, userId) =>
{
    const exists = await client.graphql({
        query: getUser,
        variables: {
            id: userId
        }
    });

    return exists.data.getUser;
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

        await client.graphql({
            query: createUser,
            variables: { input }
        });
    } catch (error) {
        console.error('ERROR, could not create user database entry:', error.errors);
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

        await client.graphql({
            query: updateUser,
            variables: { input }
        });
    } catch (error) {
        console.error('ERROR, could not update user database entry:', error);
    }
};

// used to delete the clients database entry when they delete their account
const handleDeleteUser = async (client, userId) =>
{
    try {
        await client.graphql({
            query: deleteUser,
            variables: {
                input: {
                    id: userId
                }
            },
        });
    } catch (error) {
        console.error('ERROR, could not delete user from database:', error.errors);
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
        console.error('ERROR, could not delete storage:', error);
    }
};


// ----------------------------------
//              ADMINS
// ----------------------------------

// used to list all users in database
const handleListUsers = async (client) =>
{
    try {
        const users = await client.graphql({
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

        return users.data.listUsers.items;
    } catch (error) {
        console.error('ERROR, could not get users:', error);
    }
};

// used to list all customers in database
const handleListCustomers = async (client) =>
{
    try {
        const users = await client.graphql({
            query: listUsers,
            variables: {
                filter: { access: { eq: 'Customers' }}
            }
        });

        return users.data.listUsers.items;
    } catch (error) {
        console.error('ERROR, could not get users:', error);
    }
};


// -------------------------------------------
//                  CUSTOMERS
// -------------------------------------------

// used to request a tow driver account while already authenticated as a customer
const handleRequestDriverAccount = async (client, userId) =>
{
    try {
        await client.graphql({
            query: updateUser,
            variables: {
                input: {
                    id: userId,
                    driverId: '1'
                }
            }
        });
    } catch (error) {
        console.error('ERROR, could not request a driver account:', error);
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