import Colors from "../../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleAcceptTowRequest, handleFinalTowCheck, getInitialCompassHeading } from "../../../components/towComponents";
import { useApp } from "../../../components/context";
import { sendPushNotification } from '../../../components/notifComponents'
import { Background, formatNumber, callCustomer } from "../../../components/components";
import { TowStyles, ServiceStyles, Styles } from "../../../constants/styles";
import { handleGetAddress } from "../../../components/adminComponents";
import { useLocalSearchParams, router } from "expo-router";
import { TouchableOpacity, View, Text, KeyboardAvoidingView, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Accuracy, getCurrentPositionAsync } from "expo-location";
import { post } from "aws-amplify/api";

const TowResponse = () =>
{
    const { towParam } = useLocalSearchParams();
    const request = JSON.parse(towParam);

    const { client, driverId, firstName, phoneNumber } = useApp();

    const [ address, setAddress ] = useState();
    const [ waitTime, setWaitTime ] = useState();

    const getWaitTime = async (start, destination, driverBearing) => {
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
        
        setWaitTime(routeData.Routes[0].Summary.Duration);
    }

    useEffect(() => {
        const initializeRequest = async () =>
        {
            try {
                // get approximate address
                const getAddress = await handleGetAddress(request.latitude, request.longitude);
                setAddress(getAddress);

                // get and set wait time for customer
                const driverBearing = await getInitialCompassHeading();
                const driverLocation = await getCurrentPositionAsync({ accuracy: Accuracy.BestForNavigation });
                const start = [driverLocation.coords.longitude, driverLocation.coords.latitude];
                const destination = [request.longitude, request.latitude];
                await getWaitTime(start, destination, driverBearing);
            } catch (error) {
                console.log(error);
            }
        };

        initializeRequest();
    }, []);

    return (
        <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
            <Background style={{paddingTop: 0}}>
                <View style={[Styles.block, {alignItems: 'center', paddingTop: 0}]}>
                    <View style={ServiceStyles.mapContainer}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{width: '100%', height: '100%'}}
                            showsUserLocation={true}
                            toolbarEnabled={false}
                            zoomControlEnabled={true}
                            showsTraffic={false}
                            loadingEnabled={true}
                            userInterfaceStyle='dark'
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
                    </View>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Vehicle Info</Text>
                        <Text style={Styles.text}>{request?.vehicle?.year} {request?.vehicle?.make} {request?.vehicle?.model} ({request?.vehicle?.color})</Text>
                    </View>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Tow Details</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingRight: '25%'}}>
                            <Text style={Styles.text}> - Car runs?</Text>
                            <Text style={Styles.text}>{request?.canRun ? 'Yes' : 'No'}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingRight: '25%'}}>
                            <Text style={Styles.text}> - Car rolls?</Text>
                            <Text style={Styles.text}>{request?.canRoll ? 'Yes' : 'No' }</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingRight: '25%'}}>
                            <Text style={Styles.text}> - Keys included?</Text>
                            <Text style={Styles.text}>{request?.keyIncluded ? 'Yes' : 'No' }</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingRight: '25%'}}>
                            <Text style={Styles.text}> - Vehicle is obstructed?</Text>
                            <Text style={Styles.text}>{request?.isObstructed ? 'Yes' : 'No' }</Text>
                        </View>
                    </View>
                    { request?.notes ? (
                        <View style={[Styles.infoContainer, {rowGap: 0}]}>
                            <Text style={Styles.subTitle}>Notes</Text>
                            <Text style={Styles.text}>{request?.notes}</Text>
                        </View>
                    ) : null }
                </View>
                <View style={Styles.block}>
                    <View style={TowStyles.dualButtonContainer}>
                        <TouchableOpacity
                            style={[TowStyles.button, {backgroundColor: Colors.secondary, columnGap: 10}]}
                            onPress={() => callCustomer(request?.user?.phone)}
                        >
                            <Entypo name="phone" size={25} color='white'/>
                            <Text style={Styles.actionText}>Call customer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[TowStyles.button, {backgroundColor: Colors.primary, columnGap: 10}]}
                            onPress={() => {Alert.alert(
                                'Confirmation',
                                'Once you accept this request, the customer will be able to view your location. Are you sure you want to accept the request?',
                                [
                                    { text: 'No' },
                                    {
                                        text: 'Yes',
                                        onPress: async () => {
                                            try {
                                                const isAccepted = await handleFinalTowCheck(client, request.id);
                                                if (isAccepted) {
                                                    Alert.alert(
                                                        'Tow Request',
                                                        'The request has already been accepted by another driver',
                                                        [{ text: 'OK' }]
                                                    );
                                                    router.replace('(tow)');
                                                    return;
                                                }
                                                await AsyncStorage.setItem('requestId', request?.id);
                                                const data = {
                                                    type: 'TOW_RESPONSE'
                                                };
                                                await handleAcceptTowRequest(client, request.id, 'IN_PROGRESS', waitTime, driverId, firstName, phoneNumber);
                                                await sendPushNotification(request?.user?.pushToken, 'Tow Request', 'A driver is on the way!', data);
                                                router.push({
                                                    pathname: 'towProgress',
                                                    params: { towParam: JSON.stringify(request)}
                                                });
                                            } catch (error) {
                                                console.error(error);
                                            }
                                        }
                                    }
                                ]
                            )}}
                        >
                            <AntDesign name="check" size={25} color='white'/>
                            <Text style={Styles.actionText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default TowResponse;