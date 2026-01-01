import Colors from '../../constants/colors';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { handleFinalTowCheck, handleUpdateCustomersTowRequestStatus } from '../../components/towComponents';
import { sendPushNotification } from '../../components/notifComponents';
import { handleGetAddress } from '../../components/adminComponents';
import { useApp } from '../../components/context';
import { Background, formatNumber } from '../../components/components';
import { Styles, ServiceStyles, TowStyles } from '../../constants/styles';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AntDesign, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { openURL } from 'expo-linking';

const TowResponse = () =>
{
    const { client } = useApp();
    const { customerParam } = useLocalSearchParams();
    const customer = JSON.parse(customerParam);
    const navigate = useNavigation();

    const [ waitTime, setWaitTime ] = useState();
    const [ address, setAddress ] = useState();
    const [ loading, setLoading ] = useState(false);

    const data = {
        type: "TOW_RESPONSE"
    };

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
        const fetchAddress = async () => {
            const getAddress = await handleGetAddress(customer.latitude, customer.longitude);
            setAddress(getAddress);
        };

        fetchAddress();
    }, []);

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
            <Background>
                <View style={Styles.block}>
                    <View style={ServiceStyles.mapContainer}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{width: '100%', height: '100%'}}
                            region={{
                                latitude: customer.latitude,
                                longitude: customer.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01
                            }}
                        >
                            <Marker
                                title='Customer Location'
                                coordinate={{
                                    latitude: customer.latitude,
                                    longitude: customer.longitude
                                }}
                            />
                        </MapView>
                    </View>
                </View>
                <View style={Styles.block}>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Customer Info</Text>
                        <Text style={Styles.text}>{customer?.user?.firstName} {customer?.user?.lastName} | {formatNumber(customer?.user?.phone)} | {customer?.user?.email}</Text>
                    </View>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Pickup Address</Text>
                        <Text style={[Styles.text, {width: '50%'}]}>{address}</Text>
                        <TouchableOpacity
                            onPress={() => openInGoogleMaps(customer.latitude, customer.longitude)}
                            style={{flexDirection: 'row', columnGap: 10}}
                        >
                            <Text style={[Styles.text, {fontWeight: 'bold', color: Colors.secondary}]}>| Open in Maps</Text>
                            <FontAwesome5 name='map-marked-alt' size={25} color={Colors.secondary}/>
                            <Text style={[Styles.text, {fontWeight: 'bold', color: Colors.secondary}]}>|</Text>
                        </TouchableOpacity>
                    </View>
                    { customer?.vehicle ? (
                        <View style={[Styles.infoContainer, {rowGap: 0}]}>
                            <Text style={Styles.subTitle}>Vehicle Info</Text>
                            <Text style={Styles.text}>{customer?.vehicle?.year} {customer?.vehicle?.make} {customer?.vehicle?.model} ({customer?.vehicle?.color})</Text>
                            { customer?.vehicle?.plate ? <Text style={Styles.text}>Plate: {customer?.vehicle?.plate}</Text> : null}
                            { customer?.vehicle?.vin ? <Text style={Styles.text}>VIN: {customer?.vehicle?.vin}</Text> : null }
                        </View>
                    ) : (
                        <View style={Styles.infoContainer}>
                            <Text style={[Styles.subTitle, {paddingLeft: 20, color: 'red'}]}>Customer has deleted Vehicle</Text>
                        </View>
                    )}
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Tow Details</Text>
                        <Text style={Styles.text}> - Car runs?                               {customer?.canRun ? 'Yes' : 'No' }</Text>
                        <Text style={Styles.text}> - Car rolls?                               {customer?.canRoll ? 'Yes' : 'No' }</Text>
                        <Text style={Styles.text}> - Keys included?                     {customer?.keyIncluded ? 'Yes' : 'No' }</Text>
                        <Text style={Styles.text}> - Vehicle is obstructed?         {customer?.isObstructed ? 'Yes' : 'No' }</Text>
                    </View>
                    { customer?.notes ? (
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.subTitle}>Notes</Text>
                            <Text style={Styles.text}>{customer?.notes}</Text>
                        </View>
                    ) : null }
                    { customer?.status === 'REQUESTED' ? (
                        <View style={[Styles.infoContainer, {rowGap: 0}]}>
                            <Text style={Styles.subTitle}>Wait Time</Text>
                            <Text style={Styles.text}>Set an estimated wait time for the customer</Text>
                            <View style={{flexDirection: 'row', columnGap: 10, paddingTop: 10, alignItems: 'center'}}>
                                <View style={TowStyles.inputWrapper}>
                                    <AntDesign name="clockcircle" size={25} color='white' style={Styles.icon} />
                                    <TextInput
                                        style={TowStyles.input}
                                        placeholder='wait time'
                                        placeholderTextColor={Colors.text}
                                        value={waitTime}
                                        onChangeText={setWaitTime}
                                        keyboardType='number-pad'
                                    />
                                </View>
                                <Text style={Styles.text}>minutes</Text>
                            </View>
                        </View>
                    ) : null }
                    { customer?.status !== 'COMPLETED' && customer?.status !== 'CANCELLED' ? (
                        <View style={TowStyles.dualButtonContainer}>
                            <TouchableOpacity
                                style={[TowStyles.button, {backgroundColor: Colors.button, columnGap: 10}]}
                                onPress={() => openCallCustomer(customer?.user?.phone)}
                            >
                                <Entypo name="phone" size={25} color='white'/>
                                <Text style={Styles.actionText}>Call Customer</Text>
                            </TouchableOpacity>
                            { customer?.status === 'REQUESTED' ? (
                                <TouchableOpacity
                                    style={[TowStyles.button, {backgroundColor: Colors.button, columnGap: 10}]}
                                    onPress={() => {
                                        Alert.alert(
                                            'Confirmation',
                                            'Are you sure you would like to accept the tow request?',
                                            [
                                                { text: 'No' },
                                                {
                                                    text: 'Yes',
                                                    onPress: async () => {
                                                        const isAccepted = await handleFinalTowCheck(client, customer.id);
                                                        if (isAccepted) {
                                                            Alert.alert(
                                                                'Tow Request',
                                                                'The request has already been accepted by a tow driver',
                                                                [{ text: 'OK' }]
                                                            );
                                                            navigate.reset({
                                                                index: 0,
                                                                routes: [{ name: '(admin)' }]
                                                            });
                                                            return;
                                                        }
                                                        await handleUpdateCustomersTowRequestStatus(client, customer.id, 'IN_PROGRESS', waitTime);
                                                        await sendPushNotification(customer?.user?.pushToken, 'Tow Request', 'Your Tow Driver is on the way', data);
                                                        navigate.reset({
                                                            index: 0,
                                                            routes: [{ name: '(admin)' }]
                                                        });
                                                    }
                                                }
                                            ]
                                        );
                                    }}
                                >
                                    <AntDesign name="check" size={25} color='white'/>
                                    <Text style={Styles.actionText}>Respond</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[TowStyles.button, {backgroundColor: Colors.button, columnGap: 10}]}
                                    onPress={() => {
                                        Alert.alert(
                                            'Complete Tow Request',
                                            'Mark tow request as completed?',
                                            [
                                                { text: 'No' },
                                                {
                                                    text: 'Yes',
                                                    onPress: async () => {
                                                        await handleUpdateCustomersTowRequestStatus(client, customer.id, 'COMPLETED');
                                                        const data = {
                                                            type: 'TOW_RESPONSE'
                                                        };
                                                        await sendPushNotification(customer?.user?.pushToken, 'Tow Request', 'Your tow request has been completed!', data);
                                                        Alert.alert(
                                                            'Completed',
                                                            'Tow request has been marked as completed.',
                                                            [{ text: 'OK' }]
                                                        );
                                                        navigate.reset({
                                                            index: 0,
                                                            routes: [{ name: '(admin)' }]
                                                        });
                                                    }
                                                }
                                            ]
                                        )
                                    }}
                                >
                                    <AntDesign name="check" size={25} color='white'/>
                                    <Text style={Styles.actionText}>Completed</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : null }
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default TowResponse;