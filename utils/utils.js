import nearestPointOnLine from '@turf/nearest-point-on-line';
import { distance } from '@turf/distance';
import { point, lineString } from '@turf/helpers';
import { openURL } from "expo-linking";
import { Dimensions } from "react-native";

// ******************************************
//                  GENERAL
// ******************************************

// used to call the customer
const callUser = (phone) =>
{
    const url = `tel:${phone}`;
    openURL(url);
};

// used to text the customer
const textUser = (phone) =>
{
    const url = `sms:${phone}`;
    openURL(url);
};

const openInMaps = (latitude, longitude) =>
{
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    openURL(url);
};

// used to get a responsive text size based off of screen size
const { width } = Dimensions.get('window');
const scale = width / 325;
const textSize = (size) => size * scale;

// format phone number for readability
const formatNumber = (phone) =>
{
    const clean = phone.replace(/\D/g, '').slice(-10);
    const match = clean.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return `(${match[1]}) ${match[2]} - ${match[3]}`;
    }
    return phone;
};

// format date for readability
const formatDate = (dateString) =>
{
    let date;

    if (dateString.includes('T')) {
        date = new Date(dateString);
    } else {
        const [year, month, day] = dateString.split('-');
        date = new Date(year, month - 1, day);
    }
    
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

// format time for readability
const formatTime = (timeString) =>
{
    const isValidISODate = !isNaN(Date.parse(timeString));

    const date = isValidISODate
        ? new Date(timeString)
        : new Date(`${new Date().toISOString().split('T')[0]}T${timeString}`);

    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};


// ******************************************
//                  ADMIN
// ******************************************

// extract the file path from the end of the amplify S3 URL
const extractPath = (url) => {
    const match = url.match(/\/(public\/.+?\.(jpg|jpeg|png|webp|heic))/i);
    if (match && match[1]) {
        return match[1];
    }
    throw new Error('could not extract path');
};

// *****************************************
//              APPOINTMENTS
// *****************************************

// used to set only the available time slots on the selected day
const setTimes = async (appointments, day) =>
{
    const TIME_SLOTS = [ '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00' ];

    const filteredSlots = TIME_SLOTS.filter(slot => {
        return !appointments.some(
            appointment => appointment.date === day && appointment.time === slot
        )
    });

    return filteredSlots;
};

// **************************************
//                  AUTH
// **************************************

// used to return a UI friendly string for an error message
const getErrorMessage = (error) =>
{
    console.log(error);
    switch(error?.name) {
        case 'UserNotFoundException':
            return 'A user with that email does not exist';
        case 'UserLambdaValidationException':
            return 'A user with that email already exists';
        case 'NotAuthorizedException':
            return 'The password you entered is incorrect, please try again';
        case 'CodeMismatchException':
            return 'The code you entered is incorrect, please try again';
        case 'EmptyConfirmResetPasswordNewPassword':
            return 'Please input a new password to continue';
        case 'EmptySignInUsername':
            return 'Please enter an email to sign in';
        case 'EmptySignInPassword':
            return 'Please enter a password to sign in';
        case 'EmptyConfirmSignUpCode':
            return 'Verification code must be entered to continue';
        case 'EmptyResetPasswordUsername':
            return 'Email is required to reset password';
        case 'EmptyConfirmResetPasswordConfirmationCode':
            return 'Verification code cannot be empty';
        case 'LimitExceededException':
            return 'Attempts exceeded, please try again later';
        case 'InvalidPasswordException':
            return 'Password does not meet the requirements, please try again';
        case 'InvalidParameterException':
            return 'Email has not been verified, please sign in to continue with verification';
        default:
            return 'Something went wrong, please try again later';
    }
};

// ***********************************
//                  TOW
// ***********************************

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
    switch (direction) {
        case 'Straight':
            return 'straight';
        case 'UTurn':
            return 'u-turn-left';
        case 'Left':
            if (angle >= 70 && angle < 110) return 'turn-left';
            else if (angle >= 0 && angle < 70) return 'turn-slight-left';
        case 'Right':
            if (angle >= 70 && angle < 110) return 'turn-right';
            else if (angle >= 0 && angle < 70) return 'turn-slight-right';
    }
};

// used to get the text for the next instruction
const getInstructionText = (step, distance) =>
{
    switch (step.Type) {
        case 'Turn':
        {
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
        case 'Highway':
        {
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
        case 'EnterHighway':
        {
            const highway = step.NextRoad?.RouteNumber[0]?.Value;
            const highwayDirection = step.NextRoad?.RouteNumber[0]?.Direction;

            return {
                instructionText: `Merge onto ${highway} ${highwayDirection}`,
                instructionIcon: setDirectionIcon('Straight'),
                speechText: `In ${distance} merge onto ${highwayDirection} ${highway}`
            };
        }
        case 'ContinueHighway':
        {
            const highway = step.NextRoad?.RouteNumber[0]?.Value;
            const highwayDirection = step.NextRoad?.RouteNumber[0]?.Direction;

            return {
                instructionText: `Continue on ${highway} ${highwayDirection}`,
                instructionIcon: setDirectionIcon('Straight'),
                speechText: `Continue on ${highwayDirection} ${highway} for ${distance}`
            };
        }
        case 'Exit':
        {
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
        case 'Keep':
        {
            const keepDirection = step.KeepStepDetails?.SteeringDirection;
            const keepAngle = step.KeepStepDetails?.TurnAngle;
            const nextRoad = step.CurrentRoad?.Towards[0].Value;

            return {
                instructionText: `Keep on ${keepDirection} lane towards ${nextRoad}`,
                instructionIcon: setDirectionIcon(keepDirection, keepAngle),
                speechText: `Keep on ${keepDirection} lane towards ${nextRoad}`
            };
        }
        case 'UTurn':
        {
            return {
                instructionText: `Make a U-Turn`,
                instructionIcon: setDirectionIcon('UTurn'),
                speechText: `In ${distance} make a U-turn`
            };
        }
        case 'Arrive':
        {
            return {
                instructionText: 'Arriving at your destination',
                instructionIcon: setDirectionIcon('Straight'),
                speechText: `Arriving at your destination in ${distance}`
            };
        }
        default:
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


export {
    callUser,
    textUser,
    openInMaps,
    textSize,
    formatNumber,
    formatDate,
    formatTime,
    extractPath,
    setTimes,
    getErrorMessage,
    getDistance,
    getInstructionText,
    snapToRoute,
    getArrivalTime
}