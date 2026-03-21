import nearestPointOnLine from '@turf/nearest-point-on-line';
import Colors from '../constants/colors';
import { Styles } from '../constants/styles';
import { getTowRequest, listTowRequests, towRequestsByUserId } from "../src/graphql/queries";
import { createTowRequest, updateTowRequest, deleteTowRequest } from "../src/graphql/mutations";
import { LocationClient } from '@aws-sdk/client-location';
import { fetchAuthSession } from 'aws-amplify/auth'
import { Alert, Text } from 'react-native';
import { router } from "expo-router";
import { distance } from '@turf/distance';
import { point, lineString } from '@turf/helpers';
import { post } from 'aws-amplify/api';
import { Magnetometer } from 'expo-sensors';

// ---------------------------------------
//           ADMINS & TOWDRIVERS
// ---------------------------------------

// get all active Tow Requests
const handleGetAllTowRequests = async (client) =>
{
    try {
        const result = await client.graphql({
            query: listTowRequests,
            variables: {
                filter: {
                    and: [
                        { status: { ne: 'COMPLETED' }},
                        { status: { ne: 'CANCELLED' }}
                    ]
                }
            }
        });

        return result.data.listTowRequests.items;
    } catch (error) {
        console.error('ERROR, could not get all tow requests:', error);
    }
};

const handleFinalTowCheck = async (client, towId) =>
{
    try {
        const result = await client.graphql({
            query: getTowRequest,
            variables: {
                id: towId
            }
        });

        if (result.data.getTowRequest.status === 'REQUESTED') {
            return false;
        }
        return true;
    } catch (error) {
        console.error('ERROR, could not get tow request:', error);
    }
};


// -----------------------------------------
//                  ADMINS
// -----------------------------------------

// used to update the status of a customers tow request
const handleUpdateCustomersTowRequestStatus = async (client, requestId, status, waitTime) =>
{
    let input = {
        id: requestId,
        status: status,
    };

    if (waitTime !== undefined) {
        input.waitTime = waitTime;
        const currentTime = new Date().toISOString();
        input.acceptedAt = currentTime;
    }

    try {
        await client.graphql({
            query: updateTowRequest,
            variables: { input }
        });

        if (status !== 'COMPLETED') {
            Alert.alert(
                'Sent',
                'Customer request has been updated',
                [
                    { text: 'OK' }
                ]
            );
        }
    } catch (error) {
        console.error('ERROR, could not update tow request:', error);
    }
};


// -----------------------------------------
//               TOW DRIVERS
// -----------------------------------------

// used to update tow request with drivers info
const handleAcceptTowRequest = async (client, requestId, status, waitTime, driverId, firstName, phone) =>
{
    try {
        const currentTime = new Date().toISOString();

        await client.graphql({
            query: updateTowRequest,
            variables: {
                input: {
                    id: requestId,
                    status: status,
                    waitTime: waitTime,
                    driverId: driverId,
                    driverFirstName: firstName,
                    driverPhoneNumber: phone,
                    acceptedAt: currentTime
                }
            }
        });
    } catch (error) {
        console.error('ERROR, could not accept tow request:', error);
    }
};

// used to mark the tow request as completed
const handleCompleteTowRequest = async (client, requestId) =>
{
    try {
        await client.graphql({
            query: updateTowRequest,
            variables: {
                input: {
                    id: requestId,
                    status: 'COMPLETED'
                }
            }
        });
    } catch (error) {
        console.error('ERROR, could not mark as complete:', error);
    }
};

// used to get the distance until the next step
const getDistance = (distanceUntilNextStep) =>
{
    const METERS_PER_MILE = 1609.344;
    const FEET_PER_METER = 3.28084;

    if (distanceUntilNextStep > 160) {
        let miles = distanceUntilNextStep / METERS_PER_MILE;
        return `${miles.toFixed(1)} miles`;
    }
    else {
        let feet = distanceUntilNextStep * FEET_PER_METER;
        feet = Math.round(feet / 50) * 50;
        return `${feet} ft`;
    }
}

// used to set the icon for the next turn being made
const setDirectionIcon = (direction, angle) =>
{
    if (direction === 'Straight') return 'straight';
    else if (direction === 'UTurn') return 'u-turn-left';
    else if (direction === 'Left') {
        if (angle >= 70 && angle < 110) {
            return 'turn-left';
        }
        else if (angle >= 0 && angle < 70) {
            return 'turn-slight-left';
        }
    }
    else if (direction === 'Right') {
        if (angle >= 70 && angle < 110) {
            return 'turn-right';
        }
        else if (angle >= 0 && angle < 70) {
            return 'turn-slight-right';
        }
    }
};

// used to get the text for the next instruction
const getInstructionText = (step, distance) =>
{
    // if value exists then is a highway
    if (step.Type === 'Turn') {
        let road = "";
        if (step.NextRoad) {
            road = step.NextRoad?.RoadName[0]?.Value ? step.NextRoad?.RoadName[0]?.Value : `${step.NextRoad?.RouteNumber[0].Value} ${step.NextRoad?.RouteNumber[0].Direction}`;
        }

        // set direction to turn
        const turnDirection = step.TurnStepDetails?.SteeringDirection;
        const turnAngle = Math.abs(step.TurnStepDetails?.TurnAngle);

        // set speech text
        const speechText = road === "" ? `turn ${turnDirection} in ${distance}` : `In ${distance} turn ${turnDirection} onto ${road}`;

        return {
            instructionText: `${distance}\n${road}`,
            instructionIcon: setDirectionIcon(turnDirection, turnAngle),
            speechText: speechText
        };
    }
    else if (step.Type === 'Highway') {
        const highway = step.NextRoad?.RouteNumber[0]?.Value;
        const highwayDirection = step.NextRoad?.RouteNumber[0]?.Direction;

        // set direction to turn
        const turnDirection = step.TurnStepDetails?.SteeringDirection;
        const turnAngle = Math.abs(step.TurnStepDetails?.TurnAngle);

        return {
            instructionText: `Turn ${turnDirection.toLowerCase()} onto ${highway} ${highwayDirection}`,
            instructionIcon: setDirectionIcon(turnDirection, turnAngle),
            speechText: `In ${distance} turn ${turnDirection} onto ${highwayDirection} ${highway}`
        };
    }
    else if (step.Type === 'EnterHighway') {
        const highway = step.NextRoad?.RouteNumber[0]?.Value;
        const highwayDirection = step.NextRoad?.RouteNumber[0]?.Direction;

        return {
            instructionText: `Merge onto ${highway} ${highwayDirection}`,
            instructionIcon: setDirectionIcon('Straight'),
            speechText: `In ${distance} merge onto ${highwayDirection} ${highway}`
        };
    }
    else if (step.Type === 'ContinueHighway') {
        const highway = step.NextRoad?.RouteNumber[0]?.Value;
        const highwayDirection = step.NextRoad?.RouteNumber[0]?.Direction;

        return {
            instructionText: `Continue on ${highway} ${highwayDirection}`,
            instructionIcon: setDirectionIcon('Straight'),
            speechText: `Continue on ${highwayDirection} ${highway} for ${distance}`
        };
    }
    else if (step.Type === 'Exit') {
        const exitNumber = step.ExitNumber[0]?.Value;
        const exitRoad = step.NextRoad.RoadName[0].Value;
        const exitDirection = step.ExitStepDetails?.SteeringDirection;
        const exitAngle = step.ExitStepDetails?.TurnAngle;

        return {
            instructionText: `Take exit ${exitNumber} onto ${exitRoad}`,
            instructionIcon: setDirectionIcon(exitDirection, exitAngle),
            speechText: `In ${distance} take exit ${exitNumber} onto ${exitRoad}`
        };
    }
    else if (step.Type === 'Keep') {
        const keepDirection = step.KeepStepDetails?.SteeringDirection;
        const keepAngle = step.KeepStepDetails?.TurnAngle;
        const nextRoad = step.CurrentRoad?.Towards[0].Value;

        return {
            instructionText: `Keep on ${keepDirection} lane towards ${nextRoad}`,
            instructionIcon: setDirectionIcon(keepDirection, keepAngle),
            speechText: `Keep on ${keepDirection} lane towards ${nextRoad}`
        };
    }
    else if (step.Type === 'UTurn') {
        return {
            instructionText: `Make a U-Turn`,
            instructionIcon: setDirectionIcon('UTurn'),
            speechText: `In ${distance} make a U-turn`
        };
    }
    else if (step.Type === 'Arrive') {
        return {
            instructionText: 'Arriving at your destination',
            instructionIcon: setDirectionIcon('Straight'),
            speechText: `Arriving at your destination in ${distance}`
        };
    }
    else {
        console.log(step);
    }
};

// used to snap the user to the route
const snapToRoute = (userCoords, routeCoords) =>
{
    if (!routeCoords || routeCoords.length === 0) {
        // no route yet → just use raw coords
        return { coords: userCoords, offRouteDistance: 0 };
    }

    const pt = point(userCoords);
    const line = lineString(routeCoords);

    const snapped = nearestPointOnLine(line, pt);
    const offRouteDistance = distance(pt, snapped, { units: 'meters' });

    // convert to meters from kilometers
    const distanceAlongRoute = snapped.properties.location * 1000;

    return { coords: offRouteDistance > 30 ? userCoords : snapped.geometry.coordinates, offRouteDistance, distanceAlongRoute };
};

// used to get the estimated travel time
const getArrivalTime = (duration) =>
{
    let hours, minutes;

    if (duration > 3600) {
        minutes = duration / 60;

        hours = minutes / 60;
        minutes = minutes % 60;
    }
    else {
        minutes = duration / 60;
    }

    const time = new Date();
    const arrivalTime = new Date(time.getTime() + duration * 1000);

    return {
        travelTime: hours ? `${hours.toFixed(0)} hr ${minutes.toFixed(0)} min` : `${minutes.toFixed(0)} min`,
        arrivalTime: arrivalTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    };
};

const sendDriverLocation = async (driver_id, latitude, longitude) =>
{
    try {
        const response = post({
            apiName: 'area51RestApi',
            path: '/updateTrackerLocation',
            options: {
                body: {
                    driverId: driver_id,
                    latitude,
                    longitude
                }
            }
        });

        const { body } = await response.response;
        const result = await body.json();
        console.log(result);

    } catch (error) {
        console.error('ERROR, could not update driver location:', error);
    }
};

const getInitialCompassHeading = async () =>
{
    return new Promise((resolve, reject) => {
        const subscription = Magnetometer.addListener(data => {
            const { x, y } = data;
            let angle = Math.atan2(y, x) * (180 / Math.PI); // radians -> degrees
            if (angle < 0) angle += 360
            resolve(angle);
            subscription.remove();
        });

        setTimeout(() => {
            subscription.remove();
            reject(new Error('Failed to get compass heading'));
        }, 2000);
    });
};

const getStatus = (status) =>
{
    switch (status) {
        case 'COMPLETED':
            return <Text style={Styles.tabText}>Completed</Text>;
        case 'IN_PROGRESS':
            return <Text style={[Styles.tabText, {color: Colors.primary}]}>In Progress</Text>;
        case 'CANCELLED':
            return <Text style={[Styles.tabText, {color: Colors.error}]}>Cancelled</Text>;
        case 'REQUESTED':
            return <Text style={[Styles.tabText, {color: Colors.secondary}]}>Requested</Text>;
        default:
            return <Text>N/A</Text>
    }
};


// -------------------------------------
//              CUSTOMERS
// -------------------------------------

// used to create a tow request
const handleCreateTowRequest = async (client, userId, vehicle, location, requestInfo, setTowRequest) =>
{
    try {
        const result = await client.graphql({
            query: createTowRequest,
            variables: {
                input: {
                    userId: userId,
                    vehicleId: vehicle.id,
                    status: "REQUESTED",
                    latitude: location.latitude,
                    longitude: location.longitude,
                    notes: requestInfo.notes,
                    canRun: requestInfo.canRun,
                    canRoll: requestInfo.canRoll,
                    keyIncluded: requestInfo.keyIncluded,
                    isObstructed: requestInfo.isObstructed,
                    vehicleYear: vehicle.year,
                    vehicleMake: vehicle.make,
                    vehicleModel: vehicle.model,
                    vehicleColor: vehicle.color,
                    vehiclePlate: vehicle.plate,
                    vehicleVin: vehicle.vin
                }
            }
        });

        await setTowRequest(result.data.createTowRequest);

        router.replace('towStatus');
    } catch (error) {
        console.error('ERROR, could not create tow request: ');
    }
};

// Used to get any active tow requests
const handleGetTowRequest = async (client, id) =>
{
    try {
        const request = await client.graphql({
            query: towRequestsByUserId,
            variables: {
                userId: id,
                filter: {
                    and: [
                        { status: { ne: 'COMPLETED' }},
                        { status: { ne: 'CANCELLED' }}
                    ]
                }
            }
        });

        return request.data.towRequestsByUserId.items[0];
    } catch (error) {
        console.error('ERROR, could not get tow request:', error);
    }
};

// used to update the tow request after receiving a TOW_RESPONSE notification
const handleNotifUpdateTowRequest = async (client, userId, setTowRequest) =>
{
    if (!client || !userId) return;

    try {
        const update = await handleGetTowRequest(client, userId);
        setTowRequest(update);
    } catch (error) {
        console.error('ERROR, could not update tow request after receiving notification:', error);
    }
};

// used to update the status of the tow request
const handleUpdateTowRequestStatus = async ({client, towId, userId, status, setTowRequest}) =>
{
    try {
        await client.graphql({
            query: updateTowRequest,
            variables: {
                input: {
                    id: towId,
                    status: status
                }
            }
        });
        
        const getRequest = await handleGetTowRequest(client, userId);
        setTowRequest(getRequest);
    } catch (error) {
        console.error('ERROR, could not update tow request:', error);
    }
};

// used to delete all tow requests when a user deletes their account
const handleDeleteAllTowRequests = async (client, userID) =>
{
    try {
        const result = await client.graphql({
            query: towRequestsByUserId,
            variables: {
                userId: userID
            }
        });

        const requests = result.data.towRequestsByUserId.items;

        for (const request of requests) {
            await client.graphql({
                query: deleteTowRequest,
                variables: {
                    input: {
                        id: request.id
                    }
                }
            });
        }
    } catch (error) {
        console.error('ERROR, could not delete all tow requests:', error);
    }
};

const createLocationClient = async () => {
    const session = await fetchAuthSession();

    return new LocationClient({
        region: "us-east-2",
        credentials: {
            accessKeyId: session.credentials.accessKeyId,
            secretAccessKey: session.credentials.secretAccessKey,
            sessionToken: session.credentials.sessionToken
        }
    });
}

export {
    handleGetAllTowRequests,
    handleFinalTowCheck,
    handleUpdateCustomersTowRequestStatus,
    handleAcceptTowRequest,
    handleCompleteTowRequest,
    getDistance,
    getInstructionText,
    snapToRoute,
    getArrivalTime,
    sendDriverLocation,
    getInitialCompassHeading,
    getStatus,
    handleCreateTowRequest,
    handleGetTowRequest,
    handleNotifUpdateTowRequest,
    handleUpdateTowRequestStatus,
    handleDeleteAllTowRequests,
    createLocationClient
}