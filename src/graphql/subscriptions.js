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
