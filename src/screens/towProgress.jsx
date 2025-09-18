import { useEffect, useState } from 'react';
import { MapView, Camera, ShapeSource, LineLayer, SymbolLayer, Images } from '@maplibre/maplibre-react-native';
import { get } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { LocationClient, CalculateRouteCommand } from '@aws-sdk/client-location';
import { decode } from '@here/flexpolyline';
import { getCurrentPositionAsync, watchPositionAsync, Accuracy } from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { Loading } from '../../components/components';
import { point, lineString } from '@turf/helpers';
import { distance } from '@turf/distance';
import { bearing } from '@turf/bearing';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import Colors from '../../constants/colors';

const TowProgress = () =>
{
    const { towParam } = useLocalSearchParams();
    const request = JSON.parse(towParam);

    const [ mapStyle, setMapStyle ] = useState();
    const [ routeCoords, setRouteCoords ] = useState();
    const [ userLocation, setUserLocation ] = useState();
    const [ mapBearing, setMapBearing ] = useState();

    const API_KEY = ''; // ONLY FOR TESTING DO NOT COMMIT
    const Snap_URL = `https://routes.geo.us-east-2.amazonaws.com/v2/snap-to-roads?key=${API_KEY}`

    // get the array of coordinates to map the route
    const getRoute = async (start, destination, locationClient) => {
        // calculates the route
        const command = new CalculateRouteCommand({
            CalculatorName: 'area51RouteCalculator',
            DeparturePosition: start,
            DestinationPosition: destination,
            TravelMode: 'Car'
        });

        const response = await locationClient.send(command);

        // extracts the coordinates from the response
        const routeCoords = [];
        response?.Legs?.forEach(leg => {
            leg.Steps?.forEach(step => {
                routeCoords.push(step.StartPosition);
                routeCoords.push(step.EndPosition);
            });
        });
        
        // gets the snapped geometry polyline from the API using the array from before
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

        // decodes the polyline into coordinates and returns them
        const data = await snapResponse.json();
        const decoded = decode(data.SnappedGeometry?.Polyline);
        const snappedCoords = decoded.polyline.map(([lat, lon]) => [lon, lat]); 
        
        return snappedCoords;
    };

    const snapToRoute = (userCoords, routeCoords) => {
        if (!routeCoords || routeCoords.length === 0) {
            // no route yet → just use raw coords
            return { coords: userCoords, offRouteDistance: 0 };
        }

        const pt = point(userCoords);
        const line = lineString(routeCoords);

        const snapped = nearestPointOnLine(line, pt);
        const offRouteDistance = distance(pt, snapped, { units: 'meters' });

        return { coords: snapped.geometry.coordinates, offRouteDistance };
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

                // fetch initial coordinates
                const driverLocation = await getCurrentPositionAsync({ accuracy: Accuracy.BestForNavigation });
                const rawStart = [driverLocation.coords.longitude, driverLocation.coords.latitude];

                // get route polyline
                const start = [driverLocation.coords.longitude, driverLocation.coords.latitude];
                const destination = [request.longitude, request.latitude];

                const { credentials } = await fetchAuthSession();
                const locationClient = new LocationClient({
                    region: 'us-east-2',
                    credentials
                });

                const route = await getRoute(start, destination, locationClient);
                setRouteCoords(route);

                // snap user to route
                const { coords: initialSnap } = snapToRoute(rawStart, route);
                setUserLocation(initialSnap);

                // set direction for camera
                const getMapBearing = bearing(point(route[0]), point(route[1]));
                setMapBearing(getMapBearing);
            } catch (error) {
                console.error('ERROR:', error);
            }
        };

        initializeMap();
    }, []);

    useEffect(() => {
        if (!routeCoords) return;

        let locationSubscription;

        (async () => {
            locationSubscription = await watchPositionAsync({
                accuracy: Accuracy.BestForNavigation,
                timeInterval: 1000,
                distanceInterval: 1,
            },
            (location) => {
                const rawCoords = [location.coords.longitude, location.coords.latitude];
                const { coords: snappedCoords, offRouteDistance } = snapToRoute(rawCoords, routeCoords);

                const prev = userLocation;
                const next = offRouteDistance > 20 ? rawCoords : snappedCoords;

                setUserLocation(next);
                
                if (prev) {
                    const getMapBearing = bearing(point(prev), point(next));
                    console.log('bearing:', getMapBearing);
                    setMapBearing(getMapBearing);
                }
            });
        })();

        return () => {
            if (locationSubscription) locationSubscription.remove();
        }
    }, [routeCoords]);

    return (
        <>
        { mapStyle && userLocation ? (
            <MapView
                style={{flex: 1}}
                mapStyle={mapStyle}
            >
                <Camera
                    zoomLevel={17}
                    centerCoordinate={userLocation}
                    animationMode='linearTo'
                    animationDuration={250}
                    heading={mapBearing}
                />
                <Images
                    images={{ marker: require('../../assets/images/navigation_icon.png')}}
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
                            sourceID='routeSource'
                            style={{
                                lineColor: Colors.tertiary,
                                lineWidth: 7,
                                lineCap: 'round',
                                lineJoin: 'round',
                                lineOpacity: 0.8
                            }}
                        />
                    </ShapeSource>
                )}
                <ShapeSource
                    id='userLocationSource'
                    shape={{
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: userLocation
                        }
                    }}
                >
                    <SymbolLayer
                        id='userLocationMarker'
                        style={{
                            iconImage: 'marker',
                            iconSize: 0.5,
                            iconAnchor: 'center',
                            iconRotate: mapBearing,
                            iconRotationAlignment: 'map'
                        }}
                        animationDuration={10}
                    />
                </ShapeSource>
            </MapView>
        ) : <Loading/> }
        </>
    );
};

export default TowProgress;