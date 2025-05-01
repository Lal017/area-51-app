/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
      appointment {
        id
        date
        time
        service
        notes
        createdAt
        updatedAt
        appointmentVehicleId
        owner
        __typename
      }
      createdAt
      updatedAt
      userAppointmentId
      owner
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        access
        name
        email
        phone
        pushToken
        createdAt
        updatedAt
        userAppointmentId
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getVehicle = /* GraphQL */ `
  query GetVehicle($id: ID!) {
    getVehicle(id: $id) {
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
export const listVehicles = /* GraphQL */ `
  query ListVehicles(
    $filter: ModelVehicleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVehicles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getAppointment = /* GraphQL */ `
  query GetAppointment($id: ID!) {
    getAppointment(id: $id) {
      id
      date
      time
      service
      notes
      vehicle {
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
      createdAt
      updatedAt
      appointmentVehicleId
      owner
      __typename
    }
  }
`;
export const listAppointments = /* GraphQL */ `
  query ListAppointments(
    $filter: ModelAppointmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAppointments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        time
        service
        notes
        createdAt
        updatedAt
        appointmentVehicleId
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
