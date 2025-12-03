/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
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
export const onCreateAppointment = /* GraphQL */ `
  subscription OnCreateAppointment(
    $filter: ModelSubscriptionAppointmentFilterInput
    $owner: String
  ) {
    onCreateAppointment(filter: $filter, owner: $owner) {
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
export const onUpdateAppointment = /* GraphQL */ `
  subscription OnUpdateAppointment(
    $filter: ModelSubscriptionAppointmentFilterInput
    $owner: String
  ) {
    onUpdateAppointment(filter: $filter, owner: $owner) {
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
export const onDeleteAppointment = /* GraphQL */ `
  subscription OnDeleteAppointment(
    $filter: ModelSubscriptionAppointmentFilterInput
    $owner: String
  ) {
    onDeleteAppointment(filter: $filter, owner: $owner) {
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
export const onCreateTowRequest = /* GraphQL */ `
  subscription OnCreateTowRequest(
    $filter: ModelSubscriptionTowRequestFilterInput
    $owner: String
  ) {
    onCreateTowRequest(filter: $filter, owner: $owner) {
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
      acceptedAt
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateTowRequest = /* GraphQL */ `
  subscription OnUpdateTowRequest(
    $filter: ModelSubscriptionTowRequestFilterInput
    $owner: String
  ) {
    onUpdateTowRequest(filter: $filter, owner: $owner) {
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
      acceptedAt
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteTowRequest = /* GraphQL */ `
  subscription OnDeleteTowRequest(
    $filter: ModelSubscriptionTowRequestFilterInput
    $owner: String
  ) {
    onDeleteTowRequest(filter: $filter, owner: $owner) {
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
      acceptedAt
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
