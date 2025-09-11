/* Amplify Params - DO NOT EDIT
	ENV
	GEO_AREA51MAP_NAME
	REGION
Amplify Params - DO NOT EDIT */

exports.handler = async () =>
{
    const region = process.env.REGION;
    const mapName = process.env.GEO_AREA51MAP_NAME;
    const apiKey = '' // API KEY REMOVED FOR COMMIT
    const url = `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`;

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify(url),
    };
};