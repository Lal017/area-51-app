import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Styles, ServiceStyles } from '../../constants/styles';
import { useApp } from "../../components/context";
import { Background, getRemainingETA, formatTime } from "../../components/components";
import { handleSendAdminNotif } from '../../components/notifComponents';
import { handleUpdateTowRequestStatus, handleGetTowRequest } from '../../components/towComponents';
import { onUpdateTowRequest } from '../graphql/subscriptions';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { openURL } from 'expo-linking';
import { router } from 'expo-router';

const TowStatus = () =>
{
    const { client, userId, towRequest, setTowRequest } = useApp();
    const navigate = useNavigation();
    
    const [ driverLocation, setDriverLocation ] = useState();
    const [ timeLeft, setTimeLeft ] = useState();
    const [ refreshing, setRefreshing ] = useState();

    const openCallCustomer = (phone) =>
    {
        const url = `tel:${phone}`;
        openURL(url);
    };

    const onRefresh = async () =>
    {
        setRefreshing(true);

        // reset active tow request
        const getTowRequest = await handleGetTowRequest(client, userId);
        setTowRequest(getTowRequest);
        // get minutes left
        const getTimeLeft = getRemainingETA(getTowRequest?.acceptedAt, getTowRequest?.waitTime);
        setTimeLeft(getTimeLeft);

        setRefreshing(false);
    }

    useEffect(() => {
        if (towRequest === undefined) { router.replace('(tabs)'); }
        const getTimeLeft = getRemainingETA(towRequest?.acceptedAt, towRequest?.waitTime);
        setTimeLeft(getTimeLeft);
    }, [towRequest]);

    useEffect(() => {
        const loadDriversLocation = async () =>
        {
            const stored = await AsyncStorage.getItem('driverLocation');
            try {
                const parsed = JSON.parse(stored);
                if (parsed.latitude !== null && parsed.longitude !== null) {
                    setDriverLocation(parsed);
                }
            } catch (error) {
                console.error('ERROR, could not get last stored location:', error);
            }
        };

        loadDriversLocation();

        const subscription = client.graphql({
            query: onUpdateTowRequest
        }).subscribe({
            next: async ({ data }) => {
                const getDriverLocation = {
                    latitude: data?.onUpdateTowRequest.driverLatitude,
                    longitude: data?.onUpdateTowRequest.driverLongitude
                };
                console.log('Customer Side:', getDriverLocation.latitude, getDriverLocation.longitude);
                if (getDriverLocation.latitude !== null && getDriverLocation.longitude !== null) {
                    setDriverLocation(getDriverLocation);
                }
                await AsyncStorage.setItem('driverLocation', JSON.stringify(getDriverLocation));
            },
            error: (error) => console.error(error)
        });

        return () => {
            subscription.unsubscribe();
            setDriverLocation(undefined);
        }
    }, []);

    return (
        <Background refreshing={refreshing} onRefresh={onRefresh}>
            { towRequest && towRequest?.status === "REQUESTED" ? (
            <>
                <View style={Styles.infoContainer}>
                    <View style={ServiceStyles.titleWrapper}>
                    <Text style={Styles.subTitle}>Tow Request</Text>
                    <LottieView
                        source={require('../../assets/animations/gear.json')}
                        loop
                        autoPlay
                        style={{width: 50, height: 50}}
                    />
                    </View>
                    <Text style={Styles.text}>Your request is being processed. We'll notify you with a estimated wait time shortly.</Text>
                </View>
                <View style={Styles.block}>
                    <TouchableOpacity
                        style={[Styles.actionButton, {backgroundColor: 'red', alignSelf: 'center'}]}
                        onPress={() => Alert.alert(
                            'Cancel',
                            'Are you sure you want to cancel your tow request?',
                            [
                                { text: 'No' },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        handleSendAdminNotif('Tow Request Cancelled', 'Customer has cancelled the tow request');
                                        await handleUpdateTowRequestStatus(client, towRequest.id, userId, 'CANCELLED', setTowRequest);
                                        Alert.alert(
                                            'Cancelled',
                                            'Your tow request has been cancelled',
                                            [{ text: 'OK' }]
                                        );
                                        setTowRequest(undefined);
                                        navigate.reset({
                                            index: 0,
                                            routes: [{ name: '(tabs)' }]
                                        })
                                    }
                                }
                            ]
                        )}
                    >
                        <Text style={Styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </>
            ) : towRequest?.status === "IN_PROGRESS" ? (
            <>
                { driverLocation ? (
                    <View style={ServiceStyles.mapContainer}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{width: '100%', height: '100%'}}
                            showsUserLocation={true}
                            zoomControlEnabled={true}
                            region={{
                                latitude: driverLocation?.latitude,
                                longitude: driverLocation?.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01
                            }}
                        >
                            <Marker
                                title='Driver'
                                coordinate={{
                                    latitude: driverLocation?.latitude,
                                    longitude: driverLocation?.longitude
                                }}
                            >
                                <Image
                                    source={require('../../assets/images/towTruck.png')}
                                    style={{width: 35, height: 35}}
                                    resizeMode='contain'
                                />
                            </Marker>
                        </MapView>
                    </View>
                ) : null }
                <View style={Styles.infoContainer}>
                    <View style={ServiceStyles.titleWrapper}>
                        <Text style={Styles.subTitle}>Tow Request</Text>
                        <LottieView
                            source={require('../../assets/animations/truck.json')}
                            loop
                            autoPlay
                            style={{width: 75, height: 75}}
                        />
                    </View>
                    { timeLeft > 0 ? (
                        <>
                            <Text style={Styles.text}>{towRequest?.driverFirstName ? `${towRequest?.driverFirstName}` : 'Your driver'} is on route! Estimated Wait time is {timeLeft} minutes.</Text>
                            <Text style={Styles.text}>Driver departed at: {formatTime(towRequest?.acceptedAt)}</Text>
                        </>
                    ) : (
                        <Text style={Styles.text}>{towRequest?.driverFirstName ? `${towRequest?.driverFirstName}` : 'Your driver'} is running late. we are sorry for the inconvenience</Text>
                    )}
                </View>
            </>
            ) : null}
            { towRequest?.driverPhoneNumber ? (
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <TouchableOpacity
                        style={Styles.actionButton}
                        onPress={() => openCallCustomer(towRequest?.driverPhoneNumber)}
                    >
                        <Text style={Styles.actionText}>Call Driver</Text>
                    </TouchableOpacity>
                </View>
            ) : null }
        </Background>
    );
};

export default TowStatus;