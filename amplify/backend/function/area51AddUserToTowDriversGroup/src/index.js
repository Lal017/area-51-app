/* Amplify Params - DO NOT EDIT
	AUTH_TROPLOCKSMITHAPP_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();
const USER_POOL_ID = process.env.AUTH_TROPLOCKSMITHAPP_USERPOOLID;

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    try {
        const body = JSON.parse(event.body);
        const { username } = body;

        if (!username) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing username in request body' })
            };
        }

        // remove from Customers group
        await cognito.adminRemoveUserFromGroup({
            UserPoolId: USER_POOL_ID,
            Username: username,
            GroupName: 'Customers'
        }).promise().catch(error => {
            if (error.code !== 'UserNotFoundException' && error.code !== 'ResourceNotFoundException') {
                throw error;
            }
            console.warn(`Warning: Could not remove from Customers group: ${error.message}`);
        });

        // add to TowDrivers group
        await cognito.adminAddUserToGroup({
            UserPoolId: USER_POOL_ID,
            Username: username,
            GroupName: 'TowDrivers'
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `${username} added to TowDrivers group`})
        };
    } catch (error) {
        console.error('ERROR: could not update group membership:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};