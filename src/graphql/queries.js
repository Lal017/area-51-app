/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      identityId
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
      driverId
      createdAt
      updatedAt
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
        identityId
        access
        firstName
        lastName
        email
        phone
        pushToken
        vehicles {
          items {
            year
            make
            model
            color
            plate
            vin
          }
        }
        driverId
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
      readyForPickup
      userId
      user {
        id
        identityId
        access
        firstName
        lastName
        email
        phone
        pushToken
        driverId
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
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
        readyForPickup
        userId
        user {
          firstName
          lastName
          email
          phone
          pushToken
        }
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
export const vehiclesByUserId = /* GraphQL */ `
  query VehiclesByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelVehicleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    vehiclesByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        year
        make
        model
        color
        plate
        vin
        readyForPickup
        userId
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
export const getAppointment = /* GraphQL */ `
  query GetAppointment($id: ID!) {
    getAppointment(id: $id) {
      id
      date
      time
      service
      notes
      userId
      user {
        id
        identityId
        access
        firstName
        lastName
        email
        phone
        pushToken
        driverId
        createdAt
        updatedAt
        owner
        __typename
      }
      vehicleId
      vehicle {
        id
        year
        make
        model
        color
        plate
        vin
        readyForPickup
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
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
        user {
          firstName
          lastName
          email
          phone
        }
        vehicle {
          year
          make
          model
          color
          plate
          vin
        }
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
export const appointmentsByUserId = /* GraphQL */ `
  query AppointmentsByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAppointmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    appointmentsByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        date
        time
        service
        notes
        userId
        vehicle {
          id
          year
          make
          model
        }
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
export const getTowRequest = /* GraphQL */ `
  query GetTowRequest($id: ID!) {
    getTowRequest(id: $id) {
      id
      userId
      user {
        id
        identityId
        access
        firstName
        lastName
        email
        phone
        pushToken
        driverId
        createdAt
        updatedAt
        owner
        __typename
      }
      vehicleId
      vehicle {
        id
        year
        make
        model
        color
        plate
        vin
        readyForPickup
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      status
      latitude
      longitude
      canRun
      canRoll
      keyIncluded
      isObstructed
      notes
      waitTime
      driverId
      driverFirstName
      driverPhoneNumber
      driverLatitude
      driverLongitude
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listTowRequests = /* GraphQL */ `
  query ListTowRequests(
    $filter: ModelTowRequestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTowRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        user {
          id
          firstName
          lastName
          email
          phone
          pushToken
        }
        vehicleId
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
        canRun
        canRoll
        keyIncluded
        isObstructed
        notes
        waitTime
        driverId
        driverFirstName
        driverPhoneNumber
        driverLatitude
        driverLongitude
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
export const towRequestsByUserId = /* GraphQL */ `
  query TowRequestsByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTowRequestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    towRequestsByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        vehicleId
        status
        latitude
        longitude
        canRun
        canRoll
        keyIncluded
        isObstructed
        notes
        waitTime
        driverId
        driverFirstName
        driverPhoneNumber
        driverLatitude
        driverLongitude
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
