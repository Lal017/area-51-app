/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPushToken = /* GraphQL */ `
  mutation CreatePushToken(
    $input: CreatePushTokenInput!
    $condition: ModelPushTokenConditionInput
  ) {
    createPushToken(input: $input, condition: $condition) {
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
export const updatePushToken = /* GraphQL */ `
  mutation UpdatePushToken(
    $input: UpdatePushTokenInput!
    $condition: ModelPushTokenConditionInput
  ) {
    updatePushToken(input: $input, condition: $condition) {
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
export const deletePushToken = /* GraphQL */ `
  mutation DeletePushToken(
    $input: DeletePushTokenInput!
    $condition: ModelPushTokenConditionInput
  ) {
    deletePushToken(input: $input, condition: $condition) {
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
