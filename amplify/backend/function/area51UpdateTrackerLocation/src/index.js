/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const { LocationClient, BatchUpdateDevicePositionCommand } = require('@aws-sdk/client-location');

const client = new LocationClient({ region: process.env.REGION });
const TRACKER_NAME = "area51TowDriverTracker";

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { driverId, latitude, longitude } = body;

        if (!driverId || !latitude || !longitude ) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "driverId, latitude, and longitude are required." })
            };
        }

        const params = {
            TrackerName: TRACKER_NAME,
            Updates: [
                {
                    DeviceId: driverId,
                    Position: [longitude, latitude],
                    SampleTime: new Date().toISOString(),
                },
            ],
        };

        await client.send(new BatchUpdateDevicePositionCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Driver location succesfully updated." })
        };
    } catch (error) {
        console.error("Error updating driver location:", JSON.stringify(error, null, 2));

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: error.message })
        };
    }
};
