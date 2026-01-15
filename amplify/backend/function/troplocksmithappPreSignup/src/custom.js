/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminListGroupsForUserCommand,
  AdminLinkProviderForUserCommand,
  AdminUpdateUserAttributesCommand
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({});

exports.handler = async (event) => {
  console.log(event);
  // check if another user has this email
  const response = await client.send(new ListUsersCommand({
    UserPoolId: event.userPoolId,
    Filter: `email = "${event.request.userAttributes.email}"`,
    Limit: 5
  }));

  const incomingSub = event.request.userAttributes.sub;

  const existingUser = response?.Users?.find(user => {
    const subAttr = user.Attributes?.find(attr => attr.Name === 'sub')?.Value;
    return subAttr && subAttr !== incomingSub;
  })

  if (!existingUser) {
    console.log('exiting to continue sign up');
    // continue with sign up
    return event;
  }

  // block SIGN UP IF SIGNING UP WITH COGNITO PAST THIS POINT
  // check how the user is trying to sign up
  let newUserProvider;

  if (event.triggerSource === "PreSignUp_ExternalProvider") {
    newUserProvider = event.userName.split("_")[0];
  } else {
    throw new Error('Account with this email already exists. Try signing in with Google');
  }

  // check how user originally signed up
  const groupResponse = await client.send(new AdminListGroupsForUserCommand({
    Username: existingUser.Username,
    UserPoolId: event.userPoolId
  }));

  const groups = groupResponse.Groups.map(group => group.GroupName);

  let existingUserProvider;

  if (groups.some(group => group.includes("Google"))) {
    existingUserProvider = "google";
  } else {
    existingUserProvider = "cognito";
  }

  // check old and new provider
  if (newUserProvider === 'google' && existingUserProvider === 'cognito') {
    // link accounts

    try {
      const [ providerName, providerUserId ] = event.userName.split('_');

      const sourceUser = {
        ProviderName: providerName.toLowerCase() === 'google' ? 'Google' : null,
        ProviderAttributeValue: providerUserId,
        ProviderAttributeName: 'Cognito_Subject'
      };

      const destinationUser = {
        ProviderName: 'Cognito',
        ProviderAttributeValue: existingUser.Username,
        ProviderAttributeName: 'Cognito_Subject'
      };

      await client.send(new AdminLinkProviderForUserCommand({
        UserPoolId: event.userPoolId,
        SourceUser: sourceUser,
        DestinationUser: destinationUser
      }));

      await client.send(new AdminUpdateUserAttributesCommand({
        UserPoolId: event.userPoolId,
        Username: existingUser.Username,
        UserAttributes: [
          { Name: 'email', Value: event.request.userAttributes.email },
          { Name: 'email_verified', Value: 'true' }
        ]
      }));
      
    } catch (error) {
      throw new Error(error);
    }

    return event;
  }
  else if ((newUserProvider === 'cognito' && existingUserProvider === 'google')) throw new Error('Account with this email already exists. Try signing in with Google');

  return event;
};
