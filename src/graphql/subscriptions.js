/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePushToken = /* GraphQL */ `
  subscription OnCreatePushToken(
    $filter: ModelSubscriptionPushTokenFilterInput
    $owner: String
  ) {
    onCreatePushToken(filter: $filter, owner: $owner) {
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
export const onUpdatePushToken = /* GraphQL */ `
  subscription OnUpdatePushToken(
    $filter: ModelSubscriptionPushTokenFilterInput
    $owner: String
  ) {
    onUpdatePushToken(filter: $filter, owner: $owner) {
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
export const onDeletePushToken = /* GraphQL */ `
  subscription OnDeletePushToken(
    $filter: ModelSubscriptionPushTokenFilterInput
    $owner: String
  ) {
    onDeletePushToken(filter: $filter, owner: $owner) {
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
