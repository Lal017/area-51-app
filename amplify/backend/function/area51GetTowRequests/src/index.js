/* Amplify Params - DO NOT EDIT
	API_AREA51APP_GRAPHQLAPIENDPOINTOUTPUT
	API_AREA51APP_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import crypto from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_AREA51APP_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const { Sha256 } = crypto;

const query = /* GraphQL */ `
  query LIST_TOWREQUESTS {
    listTowRequests {
      items {
        user {
          firstName
          lastName
          email
          phone
          pushToken
        }
        vehicle {
          year
          make
          model
          color
          plate
          vin
        }
        status
        latitude
        longitude
        price
        waitTime
        notes
        canRun
        canRoll
        keyIncluded
        isObstructed
        createdAt
        updatedAt
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

 export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: 'appsync',
    sha256: Sha256
  });

  const requestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host
    },
    hostname: endpoint.host,
    body: JSON.stringify({ query }),
    path: endpoint.pathname
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);

  let statusCode = 200;
  let body;
  let response;

  try {
    response = await fetch(request);
    console.log('response:', response);
    body = await response.json();
    console.log('body:', body);
    if (body.errors) statusCode = 400;
    else {
      const towRequests = body.data.listTowRequests.items.filter(item =>
        item.status !== 'CANCELLED' && item.status !== 'COMPLETED'
      );
      console.log('towRequests:', towRequests);
      body = towRequests;
    }
  } catch (error) {
    statusCode = 500;
    body = {
      errors: [
        {
          message: error.message
        }
      ]
    };
  }

  return {
    statusCode,
    //  Uncomment below to enable CORS requests
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Headers": "*"
    // }, 
    body: JSON.stringify(body)
  };
};