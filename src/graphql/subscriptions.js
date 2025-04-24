/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
      id
      access
      name
      email
      phone
      pushToken
      vehicles {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
      id
      access
      name
      email
      phone
      pushToken
      vehicles {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
      id
      access
      name
      email
      phone
      pushToken
      vehicles {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateVehicle = /* GraphQL */ `
  subscription OnCreateVehicle(
    $filter: ModelSubscriptionVehicleFilterInput
    $owner: String
  ) {
    onCreateVehicle(filter: $filter, owner: $owner) {
      id
      year
      make
      model
      color
      plate
      vin
      createdAt
      updatedAt
      userVehiclesId
      owner
      __typename
    }
  }
`;
export const onUpdateVehicle = /* GraphQL */ `
  subscription OnUpdateVehicle(
    $filter: ModelSubscriptionVehicleFilterInput
    $owner: String
  ) {
    onUpdateVehicle(filter: $filter, owner: $owner) {
      id
      year
      make
      model
      color
      plate
      vin
      createdAt
      updatedAt
      userVehiclesId
      owner
      __typename
    }
  }
`;
export const onDeleteVehicle = /* GraphQL */ `
  subscription OnDeleteVehicle(
    $filter: ModelSubscriptionVehicleFilterInput
    $owner: String
  ) {
    onDeleteVehicle(filter: $filter, owner: $owner) {
      id
      year
      make
      model
      color
      plate
      vin
      createdAt
      updatedAt
      userVehiclesId
      owner
      __typename
    }
  }
`;
