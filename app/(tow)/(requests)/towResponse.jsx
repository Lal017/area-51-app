import Colors from "../../../constants/colors";
import { handleAcceptTowRequest, handleFinalTowCheck, getInitialCompassHeading } from "../../../components/towComponents";
import { useApp } from "../../../components/context";
import { sendPushNotification } from '../../../components/notifComponents'
import { ActionButton, Background, FloatingBlock, Tab } from "../../../components/components";
import { ServiceStyles, Styles } from "../../../constants/styles";
import { handleGetAddress } from "../../../components/adminComponents";
import { useLocalSearchParams, router } from "expo-router";
import { TouchableOpacity, View, Text, KeyboardAvoidingView, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import { AntDesign, Entypo, Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Accuracy, getCurrentPositionAsync } from "expo-location";
import { post } from "aws-amplify/api";
import { callUser, textUser, openInMaps, formatNumber } from "../../../constants/utils";

const TowResponse = () =>
{
    const { requestParam } = useLocalSearchParams();
    const request = JSON.parse(requestParam);

    const { client, driverId, firstName, phoneNumber } = useApp();

    const [ address, setAddress ] = useState();
    const [ waitTime, setWaitTime ] = useState();
    const [ loading, setLoading ] = useState();

    // sets fallback vehicle values incase customer deleted the vehicle
    const vehicle = request?.vehicle ?? (request?.vehicleYear && {
        year: request.vehicleYear,
        make: request?.vehicleMake,
        model: request?.vehicleModel,
        color: request?.vehicleColor,
        plate: request?.vehiclePlate,
        vin: request?.vehicleVin
    });

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
            <Background hasTab={false}>
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <View style={ServiceStyles.mapContainer}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{width: '100%', height: '100%'}}
                            region={{
                                latitude: request.latitude,
                                longitude: request.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01
                            }}
                            showsUserLocation={true}
                        >
                            <Marker
                                title='Customer Location'
                                coordinate={{
                                    latitude: request.latitude,
                                    longitude: request.longitude
                                }}
                            />
                        </MapView>
                    </View>
                </View>
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.headerTitle}>{request?.user?.firstName} {request?.user?.lastName}</Text>
                        <Text style={Styles.tabHeader}>{request?.user?.email}</Text>
                        <Text style={Styles.tabHeader}>{formatNumber(request?.user?.phone)}</Text>
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
                </View>
                <View style={Styles.block}>
                    <Tab
                        header='Pickup Address'
                        text={<Text style={{color: Colors.secondary}}>{address}</Text>}
                        leftIcon={<Entypo name='address' size={30} style={[Styles.icon, {color: Colors.secondary}]}/>}
                        action={() => openInMaps(request.latitude, request.longitude)}
                    />
                </View>
                { request?.notes && (
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>Customer Note</Text>
                            <Text style={Styles.text}>"{request.notes}"</Text>
                        </View>
                    </View>
                )}
                <FloatingBlock>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.headerTitle}>Vehicle</Text>
                    </View>
                    <Tab
                        header={`${vehicle?.year}`}
                        text={`${vehicle?.make} ${vehicle?.model}`}
                        leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon}/>}
                        style={{height: 'none'}}
                    />
                    <Tab
                        header='Vehicle Color'
                        text={`${vehicle?.color}`}
                        leftIcon={<FontAwesome name='paint-brush' size={30} style={Styles.icon}/>}
                        style={{height: 'none'}}
                    />
                    { vehicle?.plate && (
                        <Tab
                            header='License Plate #'
                            text={`${vehicle?.plate}`}
                            leftIcon={<FontAwesome name='id-card' size={30} style={Styles.icon}/>}
                            style={{height: 'none'}}
                        />
                    )}
                    { vehicle?.vin && (
                        <Tab
                            header='VIN'
                            text={`${vehicle?.vin}`}
                            leftIcon={<FontAwesome name='barcode' size={30} style={Styles.icon}/>}
                            style={{height: 'none'}}
                        />
                    )}
                </FloatingBlock>
                <View style={Styles.block}>
                    <Tab
                        header='Does the car run?'
                        text={request?.canRun ? 'Yes' : 'No'}
                        leftIcon={<MaterialCommunityIcons name='engine' size={30} style={Styles.icon}/>}
                        style={{height: 'none', padding: 5}}
                    />
                    <Tab
                        header='Does the car roll?'
                        text={request?.canRoll ? 'Yes' : 'No'}
                        leftIcon={<MaterialCommunityIcons name='tire' size={30} style={Styles.icon}/>}
                        style={{height: 'none', padding: 5}}
                    />
                    <Tab
                        header='Are the keys included?'
                        text={request?.keyIncluded ? 'Yes' : 'No'}
                        leftIcon={<Entypo name='key' size={30} style={Styles.icon}/>}
                        style={{height: 'none', padding: 5}}
                    />
                    <Tab
                        header='Is the vehicle obstructed?'
                        text={request?.isObstructed ? 'Yes' : 'No'}
                        leftIcon={<Entypo name='warning' size={30} style={Styles.icon}/>}
                        style={{height: 'none', padding: 5}}
                    />
                </View>
                <ActionButton
                    text='Accept'
                    primaryColor={Colors.primary}
                    secondaryColor={Colors.primaryShade}
                    icon={<AntDesign name="check" size={25} style={Styles.icon}/>}
                    onPress={async () => {
                        Alert.alert(
                            'Confirmation',
                            'Once you accept this request, the customer will be able to view your location. Are you sure you want to accept the request?',
                            [
                                { text: 'No' },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        if (loading) return;
                                        setLoading(true);
                                        try {
                                            const isAccepted = await handleFinalTowCheck(client, request.id);
                                            if (isAccepted) {
                                                Alert.alert(
                                                    'Tow Request',
                                                    'The request has already been accepted by another driver',
                                                    [{ text: 'OK' }]
                                                );
                                                if (router.canDismiss) router.dismissAll();
                                                router.replace('/');
                                                return;
                                            }
                                            await handleAcceptTowRequest(client, request.id, 'IN_PROGRESS', waitTime, driverId, firstName, phoneNumber);
                                            await sendPushNotification(request?.user?.pushToken, 'Tow Request', 'A driver is on the way!', { type: 'TOW_RESPONSE' });
                                            router.replace({
                                                pathname: 'towProgress',
                                                params: { requestParam: JSON.stringify(request)}
                                            });
                                        } catch (error) {
                                            console.error(error);
                                        }
                                        setLoading(false);
                                    }
                                }
                            ]
                        )
                    }}
                />
            </Background>
        </KeyboardAvoidingView>
    );
};

export default TowResponse;