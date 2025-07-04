/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const {
  CognitoIdentityProviderClient,
  AdminLinkProviderForUserCommand,
  ListUsersCommand
} = require("@aws-sdk/client-cognito-identity-provider");
const cognito = new CognitoIdentityProviderClient({});

exports.handler = async (event) => {
  const userPoolId = event.userPoolId;
  const email = event.request.userAttributes.email;

  if (event.triggerSource === 'PreSignUp_ExternalProvider') {

    const [providerName, providerUserId] = event.userName.split('_');
    let providerNameNormalize;
    if (providerName.toLowerCase() === 'google') { providerNameNormalize = 'Google'; }
    else if (providerName.toLowerCase() === 'loginwithamazon') { providerNameNormalize = 'LoginWithAmazon'; }
    else { throw new Error(`unsuported provider: ${providerName}`); }

    const sourceUser = {
      ProviderName: providerNameNormalize,                                // google, amazon
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: providerUserId
    };

    // ------------------------------------------------------
    // get destination user info
    const users = await cognito.send(new ListUsersCommand({               // check userpool for email
      UserPoolId: userPoolId,
      Filter: `email = "${email}"`,
      Limit: 5
    }));

    // avoid linking to current email user account so filter it out
    const existingCognitoUser = users?.Users?.find(user => {
      const identitiesAttr = user.Attributes?.find(attr => attr.Name === 'identities');
      const subAttr = user.Attributes?.find(attr => attr.Name === 'sub');
      return !identitiesAttr && subAttr;
    });

    // if no other user exists with same email
    if (!existingCognitoUser) {
      console.log('No other user with same email found');
      return event;
    }

    const destinationUser = {
      ProviderName: 'Cognito',
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: existingCognitoUser.Username
    };

    try {
      await cognito.send(new AdminLinkProviderForUserCommand({
        UserPoolId: userPoolId,
        SourceUser: sourceUser,
        DestinationUser: destinationUser
      }));

      console.log('Successfully linked users');
    } catch (error) {
      console.log('Error linking user:', error);
      throw new Error('Account already exists with this email. Please sign in instead');
    }

    return event;
  }
  else if (event.triggerSource === 'PreSignUp_SignUp') {
    const users = await cognito.send(new ListUsersCommand({               // check userpool for email
      UserPoolId: userPoolId,
      Filter: `email = "${email}"`,
      Limit: 5
    }));

    const federatedUser = users?.Users?.find(user => {
      const identitiesAttr = user.Attributes?.find(attr => attr.Name === 'identities');
      return !!identitiesAttr;
    });

    if (federatedUser) {
      console.log('Federated user already exists with this email, blocking signup');
      throw new Error('An account already exists with this email using a social provider. Please sign in with that method.');
    }

    return event; // Allow sign-up
  }

  // block other trigger sources
  console.log(`Unhandled trigger source: ${event.triggerSource}`);
  throw new Error('Unsupported sign-up method.');
};
