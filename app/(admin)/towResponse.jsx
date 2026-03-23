import Colors from '../../constants/colors';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { handleUpdateCustomersTowRequestStatus } from '../../components/towComponents';
import { sendPushNotification } from '../../components/notifComponents';
import { handleGetAddress } from '../../components/adminComponents';
import { useApp } from '../../components/context';
import { ActionButton, Background, FloatingBlock, Tab } from '../../components/components';
import { Styles, ServiceStyles } from '../../constants/styles';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { AntDesign, FontAwesome, Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { callUser, textUser, openInMaps, formatNumber } from '../../constants/utils';

const TowResponse = () =>
{
    const { client } = useApp();
    const { requestParam } = useLocalSearchParams();
    const request = JSON.parse(requestParam);

    const [ address, setAddress ] = useState();
    const [ loading, setLoading ] = useState(false);

    // sets fallback vehicle values incase customer deleted the vehicle
    const vehicle = request?.vehicle ?? (request?.vehicleYear && {
        year: request.vehicleYear,
        make: request?.vehicleMake,
        model: request?.vehicleModel,
        color: request?.vehicleColor,
        plate: request?.vehiclePlate,
        vin: request?.vehicleVin
    });

    useEffect(() => {
        const fetchAddress = async () => {
            const getAddress = await handleGetAddress(request.latitude, request.longitude);
            setAddress(getAddress);
        };

        fetchAddress();
    }, []);

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
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
                </View>
                { request?.notes && (
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.tabHeader}>Customer Note</Text>
                            <Text style={Styles.text}>"{request.notes}"</Text>
                        </View>
                    </View>
                )}
                { request?.status === 'IN_PROGRESS' && (
                    <ActionButton
                        text='Complete'
                        primaryColor={Colors.primary}
                        secondaryColor={Colors.secondary}
                        icon={<AntDesign name="check" size={25} color='white' style={Styles.icon}/>}
                        onPress={async () => {
                            Alert.alert(
                                'Complete Tow Request',
                                'Mark tow request as completed?',
                                [
                                    { text: 'No' },
                                    {
                                        text: 'Yes',
                                        onPress: async () => {
                                            if (loading) return;
                                            setLoading(true);
                                            try {
                                                await handleUpdateCustomersTowRequestStatus(client, request.id, 'COMPLETED');
                                                const data = {
                                                    type: 'TOW_RESPONSE'
                                                };
                                                await sendPushNotification(request?.user?.pushToken, 'Tow Request', 'Your tow request has been completed!', data);
                                                if (router.canDismiss()) router.dismissAll();
                                                router.replace('(admin)');
                                            } catch (error) {
                                                console.error(error);
                                            }
                                            setLoading(false);
                                        }
                                    }
                                ]
                            );
                        }}
                    />
                )}
            </Background>
        </KeyboardAvoidingView>
    );
};

export default TowResponse;