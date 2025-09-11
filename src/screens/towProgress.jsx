import { useEffect, useState } from 'react';
import { MapView, Camera, ShapeSource, LineLayer } from '@maplibre/maplibre-react-native';
import { get } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { LocationClient, CalculateRouteCommand } from '@aws-sdk/client-location';
import { decode } from '@here/flexpolyline';

const TowProgress = () =>
{
    const [ mapStyle, setMapStyle ] = useState();
    const [ routeCoords, setRouteCoords ] = useState();

    const getRoute = async (start, destination, locationClient) => {
        const command = new CalculateRouteCommand({
            CalculatorName: 'area51RouteCalculator',
            DeparturePosition: start,
            DestinationPosition: destination,
            TravelMode: 'Car'
        });

        const response = await locationClient.send(command);

        const routeCoords = [];
        response?.Legs?.forEach(leg => {
            leg.Steps?.forEach(step => {
                routeCoords.push(step.StartPosition);
                routeCoords.push(step.EndPosition);
            });
        });

        console.log('routeCoords:', routeCoords);

        const API_KEY = '' // Temorary API key used for testing. removed for commit
        const Snap_URL = `https://routes.geo.us-east-2.amazonaws.com/v2/snap-to-roads?key=${API_KEY}`
        
        const body = {
            TracePoints: routeCoords.map(([lon, lat]) => ({
                Position: [lon, lat],
                Timestamp: new Date().toISOString(),
            })),
            TravelMode: 'Car',
        };

        const snapResponse = await fetch(Snap_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        });

        const data = await snapResponse.json();
        console.log('data:', data.SnappedGeometry);

        const decoded = decode(data.SnappedGeometry?.Polyline);
        const snappedCoords = decoded.polyline.map(([lat, lon]) => [lon, lat]); 
        console.log('decoded:', snappedCoords);
        
        return snappedCoords;
    };

    useEffect(() => {
        const initializeMap = async () =>
        {
            try {
                // set map style
                const restOperation = get({
                    apiName: 'area51RestApi',
                    path: '/getMapStyle'
                });

                const { body } = await restOperation.response;
                const str = await body.json();
                setMapStyle(str);

                // fetch a sample route
                const start = [-115.199377, 36.110158];
                const destination = [-115.049574, 36.181544];

                const { credentials } = await fetchAuthSession();
                const locationClient = new LocationClient({
                    region: 'us-east-2',
                    credentials
                });

                const route = await getRoute(start, destination, locationClient);
                setRouteCoords(route);
            } catch (error) {
                console.error('ERROR:', error);
            }
        };

        initializeMap();
    }, []);

    return (
        <>
        { mapStyle ? (
            <MapView
                style={{flex: 1}}
                mapStyle={mapStyle}
            >
                <Camera
                    zoomLevel={11}
                    centerCoordinate={[ -115.1728, 36.1147 ]}
                />
                { routeCoords?.length > 0 && (
                    <ShapeSource
                        id='routeSource'
                        shape={{
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: routeCoords
                            }
                        }}
                    >
                        <LineLayer
                            id='routeLine'
                            style={{
                                lineColor: 'blue',
                                lineWidth: 4
                            }}
                        />
                    </ShapeSource>
                )}
            </MapView>
        ) : null }
        </>
    );
};

export default TowProgress;