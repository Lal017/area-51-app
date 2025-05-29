import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Styles, AdminStyles, ServiceStyles } from '../../constants/styles';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { getAddressByCoords, sendPushNotification } from '../../components/adminComponents';
import { useEffect, useState } from 'react';
import { handleUpdateTowRequest, handleGetAddress } from '../../components/adminComponents';
import { useApp } from '../../components/context';
import { formatNumber } from '../../components/components';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { handleUpdateTowRequestStatus } from '../../components/scheduleComponents';

const TowResponse = () =>
{
    const { client } = useApp();
    const { customerParam } = useLocalSearchParams();
    const customer = JSON.parse(customerParam);

    const [ price, setPrice ] = useState();
    const [ waitTime, setWaitTime ] = useState();
    const [ address, setAddress ] = useState();

    const data = {
        type: "TOW_RESPONSE"
    };

    useEffect(() => {
        const fetchAddress = async () => {
            const getAddress = await handleGetAddress(customer.latitude, customer.longitude);
            console.log(getAddress);
            setAddress(getAddress);
        };

        fetchAddress();
    }, [])

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
            <ScrollView contentContainerStyle={[Styles.scrollPage, {justifyContent: 'flex-start', paddingBottom: 25}]}>
                <View style={Styles.infoContainer}>
                    <View style={Styles.block}>
                        <Text style={[Styles.title, {textAlign: 'left'}]}>Customer</Text>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Name</Text>
                            <Text style={Styles.text}>{customer.user.name}</Text>
                        </View>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Email</Text>
                            <Text style={Styles.text}>{customer.user.email}</Text>
                        </View>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Phone Number</Text>
                            <Text style={Styles.text}>{formatNumber(customer.user.phone)}</Text>
                        </View>
                    </View>
                    <View style={Styles.block}>
                        <Text style={[Styles.title, {textAlign: 'left'}]}>Location</Text>
                        <View style={[ServiceStyles.mapContainerAlt, {alignSelf: 'center'}]}>
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
                        { address ? (
                            <>
                            <Text style={Styles.subTitle}>Address</Text>
                            <Text style={Styles.text}>{address}</Text>
                            </>
                        ) : null }
                    </View>
                    <View style={Styles.block}>
                        <Text style={[Styles.title, {textAlign: 'left'}]}>Vehicle</Text>
                        <View style={AdminStyles.vehicleContainer}>
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Year</Text>
                                <Text style={Styles.text}>{customer.vehicle.year}</Text>
                            </View>
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Make</Text>
                                <Text style={Styles.text}>{customer.vehicle.make}</Text>
                            </View>
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Model</Text>
                                <Text style={Styles.text}>{customer.vehicle.model}</Text>
                            </View>
                            { customer.vehicle.color ? (
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Color</Text>
                                <Text style={Styles.text}>{customer.vehicle.color}</Text>
                            </View>
                            ) : null }
                            { customer.vehicle.plate ? (
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Plate</Text>
                                <Text style={Styles.text}>{customer.vehicle.plate}</Text>
                            </View>
                            ) : null }
                            { customer.vehicle.vin ? (
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>VIN</Text>
                                <Text style={Styles.text}>{customer.vehicle.vin}</Text>
                            </View>
                            ) : null }
                        </View>
                    </View>
                    <View style={Styles.block}>
                        <Text style={[Styles.title, {textAlign: 'left'}]}>Description</Text>
                        <Text style={Styles.text}>{customer.notes}</Text>
                    </View>
                </View>
                { customer.status === 'REQUESTED' ? (
                    <View style={Styles.container}>
                        <View style={Styles.inputContainer}>
                            <View style={Styles.inputWrapper}>
                                <FontAwesome5 name="dollar-sign" size={24} style={Styles.icon} />
                                <TextInput
                                    style={Styles.input}
                                    placeholder='price'
                                    value={price}
                                    onChangeText={setPrice}
                                    autoCapitalize='none'
                                />
                            </View>
                            <View style={Styles.inputWrapper}>
                                <FontAwesome5 name="clock" size={24} style={Styles.icon} />
                                <TextInput
                                    style={Styles.input}
                                    placeholder='estimated wait time'
                                    value={waitTime}
                                    onChangeText={setWaitTime}
                                    autoCapitalize='none'
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={Styles.actionButton}
                            onPress={() => {
                                sendPushNotification(customer.user.pushToken, 'Tow Request', 'Your tow request is ready!', data)
                                handleUpdateTowRequest(client, customer.id ,'PENDING', price, waitTime);
                            }}
                        >
                            <Text style={Styles.actionText}>Respond</Text>
                        </TouchableOpacity>
                    </View>
                ) : customer.status === 'IN_PROGRESS' ? (
                    <View style={[Styles.block, {paddingBottom: 25}]}>
                        <TouchableOpacity
                            style={Styles.actionButton}
                            onPress={() => {
                                Alert.alert(
                                    'Complete Tow Request',
                                    'Mark tow request as completed?',
                                    [
                                        { text: 'No' },
                                        {
                                            text: 'Yes',
                                            onPress: () => {
                                                handleUpdateTowRequestStatus(client, customer.id, 'COMPLETED');
                                                router.replace('/(admin)');
                                                Alert.alert(
                                                    'Completed',
                                                    'Tow request has been marked as completed.',
                                                    [{ text: 'OK' }]
                                                );
                                            }
                                        }
                                    ]
                                )
                            }}
                        >
                            <Text style={Styles.actionText}>Completed</Text>
                        </TouchableOpacity>
                    </View>
                ) : null }
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default TowResponse;