import LottieView from 'lottie-react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Colors from '../../constants/colors';
import { Styles, ServiceStyles, TowStyles } from '../../constants/styles';
import { useApp } from "../../components/context";
import { Background, formatTime, callUser } from "../../components/components";
import { handleSendAdminNotif } from '../../components/notifComponents';
import { handleUpdateTowRequestStatus, handleGetTowRequest, createLocationClient, getArrivalTime } from '../../components/towComponents';
import { View, Text, TouchableOpacity, Alert} from 'react-native';
import { GetDevicePositionCommand } from '@aws-sdk/client-location';
import { useEffect, useState } from "react";
import { router } from 'expo-router';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

const TowStatus = () =>
{
    const { client, userId, towRequest, setTowRequest } = useApp();
    
    const [ driverLocation, setDriverLocation ] = useState();
    const [ estimatedArrivalTime, setEstimatedArrivalTime ] = useState();
    const [ estimatedTravelTime, setEstimatedTravelTime ] = useState();
    const [ estimatedTimeLeft, setEstimatedTimeLeft ] = useState();
    const [ locationClient, setLocationClient ] = useState();

    // returns the drivers location
    const getDriverPosition = async (driverId) =>
    {
        const command = new GetDevicePositionCommand({
            TrackerName: "area51TowDriverTracker",
            DeviceId: driverId
        });

        const response = await locationClient.send(command);
        return response;
    };

    // calculates the remaining time left until the driver arrives
    const getTimeLeft = (acceptedAt, waitTime) =>
    {
        const timeAccepted = new Date(acceptedAt);
        const currentTime = new Date();

        const arrivalTime = new Date(timeAccepted.getTime() + waitTime * 1000);
        const remainingMs = arrivalTime - currentTime;

        const remainingMin = Math.max(Math.ceil(remainingMs / 60000), 0);
        let timeLeft;

        if (remainingMin <= 60) timeLeft = `${remainingMin} min`;
        else {
            const hours = remainingMin / 60;
            const minutes = remainingMin % 60;

            timeLeft = `${Math.floor(hours)} hr ${minutes} min`;
        }

        return {
            timeLeft: timeLeft,
            arrivalTime: formatTime(arrivalTime)
        };
    };

    // if no tow request, go back to home page
    useEffect(() => {
        if (towRequest === undefined) { router.replace('(tabs)'); }
    }, [towRequest]);

    // initializes the page
    useEffect(() => {
        const initializeRequest = async () =>
        {
            try {
                // set tow request
                const getTowRequest = await handleGetTowRequest(client, userId);
                setTowRequest(getTowRequest);

                // set Location Client
                const getLocationClient = await createLocationClient();
                setLocationClient(getLocationClient);
            
                // set estimated wait time and arrival time
                const { travelTime } = getArrivalTime(getTowRequest.waitTime);
                setEstimatedTravelTime(travelTime);
                const { timeLeft, arrivalTime } = getTimeLeft(towRequest?.acceptedAt, towRequest?.waitTime);
                setEstimatedTimeLeft(timeLeft);
                setEstimatedArrivalTime(arrivalTime);
            } catch (error) {
                console.log('error initializing', error);
            }
        }

        initializeRequest();

    } ,[]);

    // gets the location of the driver once the tow request is accepted
    useEffect(() => {
        if (!locationClient || !towRequest?.driverId) return;

        const interval = setInterval(async () => {
            try {
                if (!locationClient) { console.log('none'); return; }

                // get drivers last position
                const position = await getDriverPosition(towRequest?.driverId);
                setDriverLocation(position.Position);

                // get remaining time left
                const { timeLeft } = getTimeLeft(towRequest?.acceptedAt, towRequest?.waitTime);
                setEstimatedTimeLeft(timeLeft);
            } catch (error) {
                console.log('error here', error);
            }
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, [locationClient, towRequest?.driverId]);

    return (
        <Background>
            { towRequest?.status === 'REQUESTED' ? (
                <>
                <View style={Styles.infoContainer}>
                    <View style={ServiceStyles.titleWrapper}>
                        <Text style={Styles.headerTitle}>Tow Request</Text>
                        <LottieView
                            source={require('../../assets/animations/gear.json')}
                            loop
                            autoPlay
                            style={{width: 50, height: 50}}
                        />
                    </View>
                    <Text style={Styles.tabHeader}>Your request has been sent! We'll notify you when a driver is on route!</Text>
                </View>
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <View style={{
                        height: 150,
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <LottieView
                            source={require('../../assets/animations/paperAirplane.json')}
                            loop
                            autoPlay
                            style={{width: 250, height: 250}}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={[Styles.actionButton, {backgroundColor: 'rgba(0,0,0,0.25)', elevation: 0, alignSelf: 'center', borderWidth: 1, borderColor: 'red'}]}
                    onPress={() => Alert.alert(
                        'Cancellation',
                        'Are you sure you want to cancel your tow request?',
                        [
                            { text: 'No' },
                            {
                                text: 'Yes',
                                onPress: async () => {
                                    await handleSendAdminNotif('Tow Request Cancelled', 'Customer has cancelled the tow request');
                                    await handleUpdateTowRequestStatus({client, towId: towRequest.id, userId, status: 'CANCELLED', setTowRequest});
                                    Alert.alert(
                                        'Cancelled',
                                        'Your tow request has been cancelled',
                                        [{ text: 'OK' }]
                                    );
                                    setTowRequest(undefined);
                                    router.replace('(tabs)');
                                }
                            }
                        ]
                    )}
                >
                    <Text style={[Styles.actionText, {color: 'red'}]}>Cancel Request</Text>
                </TouchableOpacity>
                </>
            ) : towRequest?.status === 'IN_PROGRESS' ? (
                <>
                { driverLocation && (
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{width: '100%', height: '100%'}}
                        showsUserLocation={true}
                        zoomControlEnabled={true}
                        zoomControlPosition={{ x: 0, y: 0}}
                        loadingEnabled={true}
                        showsCompass={false}
                        region={{
                            latitude: driverLocation[1],
                            longitude: driverLocation[0],
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01
                        }}
                    >
                        { driverLocation && (
                        <Marker
                            title='Driver Location'
                            description='This is where the driver currently is'
                            coordinate={{ latitude: driverLocation[1], longitude: driverLocation[0]}}
                            anchor={{ x: 0.5, y: 0.5}}
                        >
                            <View
                                style={{
                                    backgroundColor: Colors.secondary,
                                    borderRadius: 50,
                                    width: 38,
                                    height: 38,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <MaterialCommunityIcons
                                    name='tow-truck'
                                    color='white'
                                    size={25}
                                />
                            </View>
                        </Marker>
                        )}
                    </MapView>
                )}
                <View style={TowStyles.secondaryContainer}>
                    <TouchableOpacity
                        style={TowStyles.iconContainer}
                        onPress={() => callUser(towRequest?.user?.phone)}
                    >
                        <Entypo
                            name='phone'
                            size={40}
                            color='white'
                        />
                    </TouchableOpacity>
                    <View style={TowStyles.lowerTextContainer}>
                        <Text style={[estimatedTimeLeft === `0 min` ? [Styles.text, {fontWeight: 'bold'}] : Styles.subTitle, {textAlign: 'center'}]}>{estimatedTimeLeft === `0 min` ? 'Driver is running late...' : estimatedTimeLeft}</Text>
                        <Text style={Styles.text}>{estimatedTravelTime} | {estimatedArrivalTime}</Text>
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
                                            await handleUpdateTowRequestStatus({client, towId: towRequest.id, userId, status: 'COMPLETED', setTowRequest});
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
                </>
            ) : null }
        </Background>
    );
};

export default TowStatus;