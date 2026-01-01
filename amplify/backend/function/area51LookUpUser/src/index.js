/* Amplify Params - DO NOT EDIT
	AUTH_TROPLOCKSMITHAPP_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const { ListUsersCommand, CognitoIdentityProviderClient, AdminListGroupsForUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const client = new CognitoIdentityProviderClient({ region: process.env.REGION });

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    console.log(body);
    const response = await client.send(
        new ListUsersCommand({
            UserPoolId: process.env.AUTH_TROPLOCKSMITHAPP_USERPOOLID,
            Filter: `email = "${body.email.toLowerCase()}"`,
            Limit: 1
        })
    );

    const existingUser = response.Users?.[0];
    console.log(response.Users);

    if (!existingUser) {
        return {
            statusCode: 200,
            body: JSON.stringify('No user found')
        };
    }

    const groupResponse = await client.send(new AdminListGroupsForUserCommand({
        Username: existingUser.Username,
        UserPoolId: process.env.AUTH_TROPLOCKSMITHAPP_USERPOOLID
    }));

    console.log(groupResponse.Groups);
    if (groupResponse.Groups[0] === 'Google' || groupResponse.Groups[0] === 'Amazon') {
        return {
            statusCode: 404,
            body: JSON.stringify(`${groupResponse.Groups[0]}`)
        };
    } else {
        return {
            statusCode: 300,
            body: JSON.stringify('User found, continue with reset password')
        };
    }
};
