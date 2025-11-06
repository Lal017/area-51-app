/* Amplify Params - DO NOT EDIT
	ENV
	GEO_AREA51MAP_NAME
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {

    const body = JSON.parse(event.body);
    const API_KEY = '' // API KEY OMMITED FOR PUSH;
    const region = 'us-east-2';
    const ROUTE_URL = `https://routes.geo.${region}.amazonaws.com/v2/routes?key=${API_KEY}`;

    const routeBody = {
        Origin: body.start,
        Destination: body.destination,
        TravelStepType: 'TurnByTurn',
        TravelMode: 'Car'
    }

    try {
        const routeResponse = await fetch(ROUTE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(routeBody),
        });

        if (!routeResponse.ok) {
            throw new Error(`Failed to fetch route: ${routeResponse.status}`);
        }

        const routeData = await routeResponse.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(routeData),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
