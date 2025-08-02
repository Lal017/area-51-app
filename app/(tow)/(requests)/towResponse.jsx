import Colors from "../../../constants/colors";
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleAcceptTowRequest, handleCompleteTowRequest, stopWatchingLocation, handleFinalTowCheck } from "../../../components/towComponents";
import { useApp } from "../../../components/context";
import { sendPushNotification } from '../../../components/notifComponents'
import { Background, formatNumber } from "../../../components/components";
import { TowStyles, ServiceStyles, Styles } from "../../../constants/styles";
import { handleGetAddress } from "../../../components/adminComponents";
import { useLocalSearchParams } from "expo-router";
import { TouchableOpacity, View, Text, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { openURL } from "expo-linking";
import { useNavigation } from "@react-navigation/native";

const LOCATION_TASK_NAME = "area51-background-location-task";

const TowResponse = () =>
{
    const { towParam } = useLocalSearchParams();
    const request = JSON.parse(towParam);

    const { client, driverId, firstName, phoneNumber } = useApp();
    const navigate = useNavigation();

    const [ address, setAddress ] = useState();
    const [ waitTime, setWaitTime ] = useState();

    const openInGoogleMaps = (latitude, longitude) =>
    {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        openURL(url);
    };

    const openCallCustomer = (phone) =>
    {
        const url = `tel:${phone}`;
        openURL(url);
    };

    useEffect(() => {
        const fetchAddress = async () =>
        {
            const getAddress = await handleGetAddress(request.latitude, request.longitude);
            setAddress(getAddress);
        };

        fetchAddress();

    }, []);

    const startWatchingLocation = async () =>
    {
        const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (!isTracking) {
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                accuracy: Location.Accuracy.High,
                timeInterval: 15000,
                distanceInterval: 0,
                foregroundService: {
                    notificationTitle: 'Location Sharing',
                    notificationBody: 'The customer is currently seeing your location',
                }
            });
        } else {
            console.error('location tracking has already started');
        }
    };

    return (
        <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
            <Background>
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <View style={ServiceStyles.mapContainer}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{width: '100%', height: '100%'}}
                            showsUserLocation={true}
                            toolbarEnabled={false}
                            zoomControlEnabled={true}
                            showsTraffic={false}
                            loadingEnabled={true}
                            region={{
                                latitude: request.latitude,
                                longitude: request.longitude,
                                latitudeDelta: 0.2,
                                longitudeDelta: 0.2
                            }}
                        >
                            <Marker
                                title="Customer Location"
                                coordinate={{
                                    latitude: request.latitude,
                                    longitude: request.longitude
                                }}
                            />
                        </MapView>
                    </View>
                </View>
                <View style={Styles.block}>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Customer Info</Text>
                        <Text style={Styles.text}>{request?.user?.firstName} {request?.user?.lastName} | {formatNumber(request?.user?.phone)}</Text>
                    </View>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Pickup Address</Text>
                        <Text style={[Styles.text, {width: '50%'}]}>{address}</Text>
                        <TouchableOpacity
                            onPress={() => openInGoogleMaps(request.latitude, request.longitude)}
                            style={{flexDirection: 'row', columnGap: 10}}
                        >
                            <Text style={[Styles.text, {fontWeight: 'bold', color: Colors.secondary}]}>| Preview in Maps</Text>
                            <FontAwesome5 name='map-marked-alt' size={25} color={Colors.secondary}/>
                            <Text style={[Styles.text, {fontWeight: 'bold', color: Colors.secondary}]}>|</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Vehicle Info</Text>
                        <Text style={Styles.text}>{request?.vehicle?.year} {request?.vehicle?.make} {request?.vehicle?.model} ({request?.vehicle?.color})</Text>
                    </View>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Tow Details</Text>
                        <Text style={Styles.text}> - Car runs?                               {request?.canRun ? 'Yes' : 'No' }</Text>
                        <Text style={Styles.text}> - Car rolls?                               {request?.canRoll ? 'Yes' : 'No' }</Text>
                        <Text style={Styles.text}> - Keys included?                     {request?.keyIncluded ? 'Yes' : 'No' }</Text>
                        <Text style={Styles.text}> - Vehicle is obstructed?         {request?.isObstructed ? 'Yes' : 'No' }</Text>
                    </View>
                    { request?.notes ? (
                        <View style={[Styles.infoContainer, {rowGap: 0}]}>
                            <Text style={Styles.subTitle}>Notes</Text>
                            <Text style={Styles.text}>{request?.notes}</Text>
                        </View>
                    ) : null }
                    { request?.status === 'REQUESTED' ? (
                        <View style={[Styles.infoContainer, {rowGap: 0}]}>
                            <Text style={Styles.subTitle}>Wait Time</Text>
                            <Text style={Styles.text}>Set an estimated wait time for the customer (in minutes)</Text>
                            <View style={{flexDirection: 'row', columnGap: 10, paddingTop: 10, alignItems: 'center'}}>
                                <View style={TowStyles.inputWrapper}>
                                    <AntDesign name="clockcircle" size={25} color='white' style={Styles.icon}/>
                                    <TextInput
                                        placeholder='wait time'
                                        placeholderTextColor={Colors.text}
                                        value={waitTime}
                                        onChangeText={setWaitTime}
                                        keyboardType='number-pad'
                                        style={TowStyles.input}
                                    />
                                </View>
                                <Text style={Styles.text}>minutes</Text>
                            </View>
                        </View>
                    ) : null }
                </View>
                <View style={Styles.block}>
                    <View style={TowStyles.dualButtonContainer}>
                        <TouchableOpacity
                            style={[TowStyles.button, {backgroundColor: Colors.secondary}]}
                            onPress={() => openCallCustomer(request?.user?.phone)}
                        >
                            <Entypo name="phone" size={25} color='white'/>
                            <Text style={Styles.actionText}>Call customer</Text>
                        </TouchableOpacity>
                        { request?.status === 'REQUESTED' ? (
                            <TouchableOpacity
                                style={[TowStyles.button, {backgroundColor: Colors.primary}]}
                                onPress={() => {Alert.alert(
                                    'Confirmation',
                                    'Once you accept this request, the customer will be able to view your location. Are you sure you want to accept the request?',
                                    [
                                        { text: 'No' },
                                        {
                                            text: 'Yes',
                                            onPress: async () => {
                                                const isAccepted = await handleFinalTowCheck(client, request.id);
                                                if (isAccepted) {
                                                    Alert.alert(
                                                        'Tow Request',
                                                        'The request has already been accepted by another driver',
                                                        [{ text: 'OK' }]
                                                    );
                                                    navigate.reset({
                                                        index: 0,
                                                        routes: [{ name: '(tow)' }]
                                                    });
                                                    return;
                                                }
                                                await AsyncStorage.setItem('requestId', request?.id);
                                                const data = {
                                                    type: 'TOW_RESPONSE'
                                                };
                                                await handleAcceptTowRequest(client, request.id, 'IN_PROGRESS', waitTime, driverId, firstName, phoneNumber);
                                                await sendPushNotification(request?.user?.pushToken, 'Tow Request', 'A driver is on the way!', data);
                                                await startWatchingLocation();
                                                navigate.reset({
                                                    index: 0,
                                                    routes: [{ name: '(tow)'}]
                                                });
                                                openInGoogleMaps(request?.latitude, request?.longitude);
                                            }
                                        }
                                    ]
                                )}}
                            >
                                <AntDesign name="check" size={25} color='white'/>
                                <Text style={Styles.actionText}>Accept</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[TowStyles.button, {backgroundColor: Colors.secondary}]}
                                onPress={() => {Alert.alert(
                                    'Completed',
                                    'Mark this tow request as completed?',
                                    [
                                        { text: 'No' },
                                        {
                                            text: 'Yes',
                                            onPress: async () => {
                                                await stopWatchingLocation();
                                                await handleCompleteTowRequest(client, request.id);
                                                const data = {
                                                    type: 'TOW_RESPONSE'
                                                };
                                                await sendPushNotification(request?.user?.pushToken, 'Tow Request', 'Your tow request has been completed!', data);
                                                Alert.alert(
                                                    'Completed',
                                                    'Tow request has been completed!',
                                                    [{ text: 'OK' }]
                                                );
                                                navigate.reset({
                                                    index: 0,
                                                    routes: [{ name: '(tow)'}]
                                                });
                                            }
                                        }
                                    ]
                                )}}
                            >
                                <AntDesign name="check" size={25} color='white'/>
                                <Text style={Styles.actionText}>Complete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default TowResponse;