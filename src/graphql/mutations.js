/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      access
      firstName
      lastName
      email
      phone
      pushToken
      vehicles {
        nextToken
        __typename
      }
      appointments {
        nextToken
        __typename
      }
      towRequests {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      access
      firstName
      lastName
      email
      phone
      pushToken
      vehicles {
        nextToken
        __typename
      }
      appointments {
        nextToken
        __typename
      }
      towRequests {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      access
      firstName
      lastName
      email
      phone
      pushToken
      vehicles {
        nextToken
        __typename
      }
      appointments {
        nextToken
        __typename
      }
      towRequests {
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
export const createVehicle = /* GraphQL */ `
  mutation CreateVehicle(
    $input: CreateVehicleInput!
    $condition: ModelVehicleConditionInput
  ) {
    createVehicle(input: $input, condition: $condition) {
      id
      year
      make
      model
      color
      plate
      vin
      userId
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateVehicle = /* GraphQL */ `
  mutation UpdateVehicle(
    $input: UpdateVehicleInput!
    $condition: ModelVehicleConditionInput
  ) {
    updateVehicle(input: $input, condition: $condition) {
      id
      year
      make
      model
      color
      plate
      vin
      userId
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteVehicle = /* GraphQL */ `
  mutation DeleteVehicle(
    $input: DeleteVehicleInput!
    $condition: ModelVehicleConditionInput
  ) {
    deleteVehicle(input: $input, condition: $condition) {
      id
      year
      make
      model
      color
      plate
      vin
      userId
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createAppointment = /* GraphQL */ `
  mutation CreateAppointment(
    $input: CreateAppointmentInput!
    $condition: ModelAppointmentConditionInput
  ) {
    createAppointment(input: $input, condition: $condition) {
      id
      date
      time
      service
      notes
      userId
      vehicleId
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateAppointment = /* GraphQL */ `
  mutation UpdateAppointment(
    $input: UpdateAppointmentInput!
    $condition: ModelAppointmentConditionInput
  ) {
    updateAppointment(input: $input, condition: $condition) {
      id
      date
      time
      service
      notes
      userId
      vehicleId
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteAppointment = /* GraphQL */ `
  mutation DeleteAppointment(
    $input: DeleteAppointmentInput!
    $condition: ModelAppointmentConditionInput
  ) {
    deleteAppointment(input: $input, condition: $condition) {
      id
      date
      time
      service
      notes
      userId
      vehicleId
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createTowRequest = /* GraphQL */ `
  mutation CreateTowRequest(
    $input: CreateTowRequestInput!
    $condition: ModelTowRequestConditionInput
  ) {
    createTowRequest(input: $input, condition: $condition) {
      id
      userId
      vehicleId
      status
      latitude
      longitude
      notes
      price
      waitTime
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateTowRequest = /* GraphQL */ `
  mutation UpdateTowRequest(
    $input: UpdateTowRequestInput!
    $condition: ModelTowRequestConditionInput
  ) {
    updateTowRequest(input: $input, condition: $condition) {
      id
      userId
      vehicleId
      status
      latitude
      longitude
      notes
      price
      waitTime
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteTowRequest = /* GraphQL */ `
  mutation DeleteTowRequest(
    $input: DeleteTowRequestInput!
    $condition: ModelTowRequestConditionInput
  ) {
    deleteTowRequest(input: $input, condition: $condition) {
      id
      userId
      vehicleId
      status
      latitude
      longitude
      notes
      price
      waitTime
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
