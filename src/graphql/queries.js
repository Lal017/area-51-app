/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPushToken = /* GraphQL */ `
  query GetPushToken($id: ID!) {
    getPushToken(id: $id) {
      id
      pushToken
      access
      name
      email
      phone
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listPushTokens = /* GraphQL */ `
  query ListPushTokens(
    $filter: ModelPushTokenFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPushTokens(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        pushToken
        access
        name
        email
        phone
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
