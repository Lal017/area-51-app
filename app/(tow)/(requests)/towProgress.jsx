import Colors from '../../../constants/colors';
import length from '@turf/length';
import lineSlice from '@turf/line-slice';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { BackgroundAlt, Loading, Tab } from '../../../components/components';
import { callUser, textUser } from '../../../constants/utils';
import { Styles, TowStyles } from '../../../constants/styles';
import { useApp } from '../../../components/context';
import { getDistance, getInstructionText, snapToRoute, getArrivalTime, sendDriverLocation, getInitialCompassHeading, handleCompleteTowRequest } from '../../../components/towComponents';
import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MapView, Camera, ShapeSource, LineLayer, SymbolLayer, Images } from '@maplibre/maplibre-react-native';
import { get, post } from 'aws-amplify/api';
import { decode } from '@here/flexpolyline';
import { getCurrentPositionAsync, watchPositionAsync, Accuracy } from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { point, lineString } from '@turf/helpers';
import { bearing } from '@turf/bearing';
import { along } from '@turf/along';
import { Entypo, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { speak, stop } from 'expo-speech';
import { sendPushNotification } from '../../../components/notifComponents';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { handleGetAddress } from '../../../components/adminComponents';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TowProgress = () =>
{
    const { requestParam } = useLocalSearchParams();
    const request = JSON.parse(requestParam);

    const { client, driverId } = useApp();

    const insets = useSafeAreaInsets();

    const [ mapStyle, setMapStyle ] = useState();
    const [ routeCoords, setRouteCoords ] = useState();
    const [ steps, setSteps ] = useState();
    const [ currentInstruction, setCurrentInstruction ] = useState();
    const [ estimatedTravelTime, setEstimatedTravelTime ] = useState();
    const [ estimatedArrivalTime, setEstimatedArrivalTime ] = useState();
    const [ estimatedDistance, setEstimatedDistance ] = useState()
    const [ direction, setDirection ] = useState();
    const [ userLocation, setUserLocation ] = useState();
    const [ mapBearing, setMapBearing ] = useState();
    const [ isMute, setIsMute ] = useState(false);
    const [ rerouting, setRerouting ] = useState(false);
    const [ address, setAddress ] = useState();
    const [ showContent, setShowContent ] = useState(false);

    const totalDurationRef = useRef();
    const isMuteRef = useRef(isMute);
    const bottomSheetRef = useRef(null);

    // sets fallback vehicle values incase customer deleted the vehicle
    const vehicle = request?.vehicle ?? (request?.vehicleYear && {
        year: request.vehicleYear,
        make: request?.vehicleMake,
        model: request?.vehicleModel,
        color: request?.vehicleColor,
        plate: request?.vehiclePlate,
        vin: request?.vehicleVin
    });

    // get the array of coordinates to map the route
    const getRoute = async (start, destination, driverBearing) => {
        // calculates the route
        const request = post({
            apiName: 'area51RestApi',
            path: '/getRoute',
            options: {
                body: {
                    start,
                    destination,
                    userHeading: driverBearing
                }
            }
        });

        const { body } = await request.response;
        const routeData = await body.json();

        const steps = routeData.Routes[0].Legs[0].VehicleLegDetails.TravelSteps;
        totalDurationRef.current = routeData.Routes[0].Summary.Duration;

        const {travelTime, arrivalTime} = getArrivalTime(routeData.Routes[0].Summary.Duration);
        setEstimatedDistance(getDistance(routeData.Routes[0].Summary.Distance));
        setEstimatedTravelTime(travelTime);
        setEstimatedArrivalTime(arrivalTime);
        
        // decode polyline
        const decoded = decode(routeData.Routes[0].Legs[0].Geometry.Polyline);
        const snappedCoords = decoded.polyline.map(([lat, lon]) => [lon, lat]);
        const line = lineString(snappedCoords);

        const stepRanges = steps.map((step, i) => {
            const startIndex = step.GeometryOffset;
            const endIndex = i < steps.length - 1 ? steps[i + 1].GeometryOffset : snappedCoords.length - 1;

            const startCoord = snappedCoords[startIndex];
            const endCoord = snappedCoords[endIndex];

            const segment = lineSlice(point(startCoord), point(endCoord), line);
            const segmentDistance = length(segment, { units: 'meters' });

            return { ...step, startCoord, endCoord, segmentDistance };
        });

        let cumulative = 0;
        for (let i = 0; i < stepRanges.length; i++) {
            stepRanges[i].startDistance = cumulative;
            cumulative += stepRanges[i].segmentDistance;
            stepRanges[i].endDistance = cumulative;
        }

        setSteps(stepRanges);
        return snappedCoords;
    };

    useEffect(() => {
        const initializeMap = async () =>
        {
            try {
                // set map style
                const restOperation = get({
                    apiName: 'area51RestApi',
                    path: '/getMapStyling'
                });

                const { body } = await restOperation.response;
                const str = await body.json();
                setMapStyle(str);

                // fetch initial coordinates
                const driverLocation = await getCurrentPositionAsync({ accuracy: Accuracy.BestForNavigation });
                const rawStart = [driverLocation.coords.longitude, driverLocation.coords.latitude];
                const driverBearing = await getInitialCompassHeading();

                // get route polyline
                const start = [driverLocation.coords.longitude, driverLocation.coords.latitude];
                const destination = [request.longitude, request.latitude];

                const route = await getRoute(start, destination, driverBearing);
                setRouteCoords(route);

                // snap user to route
                const { coords: initialSnap } = snapToRoute(rawStart, route);
                setUserLocation(initialSnap);

                // set direction for camera
                const getMapBearing = bearing(point(route[0]), point(route[1]));
                setMapBearing(getMapBearing);

                // get address
                const getAddress = await handleGetAddress(request.latitude, request.longitude);
                setAddress(getAddress);
            } catch (error) {
                console.error('ERROR, could not initialize map:', error);
            }
        };

        initializeMap();
    }, []);

    useEffect(() => {
        if (!routeCoords) return;

        let locationSubscription;
        let lastIndex = -1;
        const line = lineString(routeCoords);
        const routeLength = length(line, { units: 'meters' });

        (async () => {
            locationSubscription = await watchPositionAsync({
                accuracy: Accuracy.BestForNavigation,
                timeInterval: 1000,
                distanceInterval: 1,
            },
            async (location) => {
                const rawCoords = [location.coords.longitude, location.coords.latitude];
                const { coords: snappedCoords, offRouteDistance, distanceAlongRoute } = snapToRoute(rawCoords, routeCoords);

                // send coordinates to backend
                try {
                    await sendDriverLocation(driverId, location.coords.latitude, location.coords.longitude);
                    console.log('sent');
                } catch (error) {
                    console.log('error sending coordinates:', error);
                }

                // handle rerouting
                if (offRouteDistance > 50) {
                    setRerouting(true);
                    // get route polyline
                    const start = [location.coords.longitude, location.coords.latitude];
                    const destination = [request.longitude, request.latitude];

                    const route = await getRoute(start, destination, location.coords.heading);
                    setRouteCoords(route);

                    // snap user to route
                    const { coords: initialSnap } = snapToRoute(rawCoords, route);
                    setUserLocation(initialSnap);

                    // set direction for camera
                    const getMapBearing = bearing(point(route[0]), point(route[1]));
                    setMapBearing(getMapBearing);
                    setRerouting(false);
                    return;
                }
                if (steps && steps.length > 0) {
                    const currentStep = steps.find(
                        step => distanceAlongRoute >= step.startDistance && distanceAlongRoute < step.endDistance
                    );

                if (currentStep) {
                    let currentIndex = steps.indexOf(currentStep);
                    if (steps[currentIndex + 1].Type === 'Continue') { currentIndex++; }
                    const distanceUntilNextStep = steps[currentIndex].endDistance - distanceAlongRoute;

                    const progress = distanceAlongRoute / routeLength;
                    const remainingTime = totalDurationRef.current * (1 - progress);

                    const { travelTime } = getArrivalTime(remainingTime);
                    setEstimatedTravelTime(travelTime);

                    setEstimatedDistance(getDistance(routeLength - distanceAlongRoute));

                    const { instructionText, instructionIcon, speechText } = getInstructionText(steps[currentIndex + 1], getDistance(distanceUntilNextStep));
                    
                    // speak
                    if (!isMuteRef.current && (currentIndex !== lastIndex || distanceUntilNextStep === 60)) {
                        speak(speechText);
                        lastIndex = currentIndex;
                    }

                    setCurrentInstruction(instructionText);
                    setDirection(instructionIcon);
                } else if (distanceAlongRoute >= steps[steps.length - 1].endDistance - 10) {
                    console.log('Arrived at destination');
                }
                }
                // add 10 meters to current distance along route
                const lookAheadDistance = Math.min(distanceAlongRoute + 10, routeLength);

                // calculate total length of route so you dont go off the route
                const pointAhead = along(line, lookAheadDistance, { units: 'meters' });
                const getMapBearing = bearing(point(snappedCoords), point(pointAhead.geometry.coordinates));
   
                setMapBearing(getMapBearing);
                setUserLocation(snappedCoords);
            });
        })();

        return () => {
            if (locationSubscription) locationSubscription.remove();
        };

    }, [routeCoords]);

    // update ref if isMute changes
    useEffect(() => {
        isMuteRef.current = isMute;
    }, [isMute]);

    return (
        <GestureHandlerRootView>
            <BackgroundAlt hasTab={false}>
            { mapStyle && userLocation ? (
                <MapView
                    style={{flex: 1}}
                    mapStyle={mapStyle}
                    compassEnabled={false}
                >
                    <Camera
                        zoomLevel={17}
                        centerCoordinate={userLocation}
                        animationMode='linearTo'
                        animationDuration={250}
                        heading={mapBearing}
                        pitch={35}
                    />
                    <Images
                        images={{
                            marker: require('../../../assets/images/navigation_icon.png'),
                            destination: require('../../../assets/images/marker.png')
                        }}
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
                                    lineWidth: 9,
                                    lineCap: 'round',
                                    lineJoin: 'round',
                                    lineOpacity: 1
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
                    <ShapeSource
                        id='destinationMarker'
                        shape={{
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [request.longitude, request.latitude]
                            }
                        }}
                    >
                        <SymbolLayer
                            id='destinationSymbol'
                            style={{
                                iconImage: 'destination',
                                iconSize: 0.5,
                                iconAnchor: 'center'
                            }}
                        />
                    </ShapeSource>
                </MapView>
            ) : <Loading/> }
            { currentInstruction ? (
                <View style={TowStyles.mainContainer}>
                    <View style={TowStyles.stepContainer}>
                        <View style={TowStyles.iconContainer}>
                            <MaterialIcons
                                name={direction}
                                size={50}
                                color='white'
                            />
                        </View>
                        <View style={TowStyles.textContainer}>
                            <Text style={Styles.subTitle}>{currentInstruction || 'Calculating Route...'}</Text>
                        </View>
                        <TouchableOpacity
                            style={TowStyles.iconContainer}
                            onPress={() => {
                                setIsMute(!isMute);
                                if (!isMute) stop();
                            }}
                        >
                            <MaterialIcons
                                name={isMute ? 'volume-off' : 'volume-up'}
                                size={35}
                                color='white'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : rerouting ? (
                <View style={TowStyles.mainContainer}>
                    <View style={TowStyles.stepContainer}>
                        <Text style={Styles.subTitle}>Rerouting...</Text>
                    </View>
                </View>
            ) : null}
            { estimatedTravelTime && estimatedDistance && estimatedArrivalTime && (
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={[`${13 + (insets.bottom / 10)}%`,'80%']}
                    index={0}
                    backgroundStyle={{ backgroundColor: Colors.background }}
                    enablePanDownToClose={false}
                    enableDynamicSizing={false}
                    onChange={(index) => {
                        if (index === 1) setShowContent(true);
                        else setShowContent(false);
                    }}
                >
                    <BottomSheetView style={{ paddingBottom: insets.bottom }}>
                        <View style={Styles.block}>
                            <View style={TowStyles.secondaryContainer}>
                                <TouchableOpacity
                                    style={TowStyles.iconContainer}
                                    onPress={() => bottomSheetRef?.current?.snapToIndex(showContent ? 0 : 1)}
                                >
                                    <MaterialCommunityIcons
                                        name='account-details'
                                        size={40}
                                        color='white'
                                    />
                                </TouchableOpacity>
                                <View style={TowStyles.lowerTextContainer}>
                                    <Text style={Styles.subTitle}>{estimatedTravelTime}</Text>
                                    <Text style={Styles.text}>{estimatedDistance} | {estimatedArrivalTime}</Text>
                                </View>
                                <TouchableOpacity
                                    style={TowStyles.iconContainer}
                                    onPress={() => {
                                        Alert.alert(
                                            'Request Completed',
                                            'Would you like to mark the tow request as completed?',
                                            [
                                                { text: 'No' },
                                                {
                                                    text: 'Yes',
                                                    onPress: async () => {
                                                        await handleCompleteTowRequest(client, request.id);
                                                        await sendPushNotification(request?.user?.pushToken, 'Tow Request', 'Your tow request has been completed!', { type: 'TOW_RESPONSE' });
                                                        if (router.canDismiss()) router.dismissAll();
                                                        router.replace('/');
                                                    }
                                                }
                                            ]
                                        )
                                    }}
                                >
                                    <Entypo
                                        name='check'
                                        size={40}
                                        color={Colors.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={Styles.block}>
                            { showContent && (
                                <>
                                <View style={Styles.infoContainer}>
                                    <Text style={[Styles.headerTitle, {textAlign: 'left'}]}>{request?.user?.firstName} {request?.user?.lastName}</Text>
                                </View>
                                <View style={[Styles.rightIcon, {flexDirection: 'row', columnGap: 10}]}>
                                    <TouchableOpacity
                                        style={{padding: 5, justifyContent: 'center', alignItems: 'center'}}
                                        onPress={() => callUser(request?.user?.phone)}
                                    >
                                        <Entypo name='phone' size={30} color='white'/>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{padding: 5, justifyContent: 'center', alignItems: 'center'}}
                                        onPress={() => textUser(request?.user?.phone)}
                                    >
                                        <Entypo name='message' size={30} color='white'/>
                                    </TouchableOpacity>
                                </View>
                                <Tab
                                    header={`${vehicle?.year} (${vehicle?.color})`}
                                    text={`${vehicle?.make} ${vehicle?.model}`}
                                    leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon}/>}
                                    style={{height: 'none'}}
                                />
                                <Tab
                                    header='Does the car run?'
                                    text={request?.canRun ? 'Yes' : 'No'}
                                    leftIcon={<MaterialCommunityIcons name='engine' size={30} style={Styles.icon}/>}
                                    style={{height: 'none'}}
                                />
                                <Tab
                                    header='Does the car roll?'
                                    text={request?.canRoll ? 'Yes' : 'No'}
                                    leftIcon={<MaterialCommunityIcons name='tire' size={30} style={Styles.icon}/>}
                                    style={{height: 'none'}}
                                />
                                <Tab
                                    header='Are the keys included?'
                                    text={request?.keyIncluded ? 'Yes' : 'No'}
                                    leftIcon={<Entypo name='key' size={30} style={Styles.icon}/>}
                                    style={{height: 'none'}}
                                />
                                <Tab
                                    header='Is the vehicle obstructed?'
                                    text={request?.isObstructed ? 'Yes' : 'No'}
                                    leftIcon={<Entypo name='warning' size={30} style={Styles.icon}/>}
                                    style={{height: 'none'}}
                                />
                                { request?.note && (
                                    <View style={Styles.infoContainer}>
                                        <Text style={Styles.headerTitle}>Customer Note</Text>
                                        <Text style={Styles.text}>"{request.notes}"</Text>
                                    </View>
                                )}
                                </>
                            )}
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            )}
            </BackgroundAlt>
        </GestureHandlerRootView>
    );
};

export default TowProgress;