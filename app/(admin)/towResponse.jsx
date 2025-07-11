import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { Styles, AdminStyles, ServiceStyles } from '../../constants/styles';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { handleUpdateTowRequest, handleGetAddress, sendPushNotification } from '../../components/adminComponents';
import { useApp } from '../../components/context';
import { Background, formatNumber } from '../../components/components';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

const TowResponse = () =>
{
    const { client } = useApp();
    const { customerParam } = useLocalSearchParams();
    const customer = JSON.parse(customerParam);
    const navigate = useNavigation();

    const [ price, setPrice ] = useState();
    const [ waitTime, setWaitTime ] = useState();
    const [ address, setAddress ] = useState();

    const data = {
        type: "TOW_RESPONSE"
    };

    useEffect(() => {
        const fetchAddress = async () => {
            const getAddress = await handleGetAddress(customer.latitude, customer.longitude);
            setAddress(getAddress);
        };

        fetchAddress();
    }, [])

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
            <Background>
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={[Styles.title, {textAlign: 'left'}]}>Customer</Text>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Name</Text>
                            <Text style={Styles.text}>{customer.user.firstName} {customer.user.lastName}</Text>
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
                </View>
                <View style={Styles.block}>
                    <Text style={[Styles.title, {paddingLeft: 20}]}>Location</Text>
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
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.subTitle}>Approximate Address</Text>
                            <Text style={Styles.text}>{address}</Text>
                        </View>
                    ) : null }
                </View>
                { customer.vehicle ? (
                    <View style={Styles.block}>
                        <Text style={[Styles.title, {paddingLeft: 20}]}>Vehicle</Text>
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
                ) : (
                    <View style={Styles.block}>
                        <Text style={[Styles.subTitle, {paddingLeft: 20, color: 'red'}]}>Customer has deleted Vehicle</Text>
                    </View>
                )}
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={[Styles.title, {textAlign: 'left'}]}>Towing Info</Text>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Vehicle runs?</Text>
                            <Text style={Styles.text}>{customer.canRun ? 'Yes' : 'No'}</Text>
                        </View>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Vehicle rolls?</Text>
                            <Text style={Styles.text}>{customer.canRoll ? 'Yes' : 'No'}</Text>
                        </View>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Keys included?</Text>
                            <Text style={Styles.text}>{customer.keyIncluded ? 'Yes' : 'No'}</Text>
                        </View>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Obstructions?</Text>
                            <Text style={Styles.text}>{customer.isObstructed ? 'Yes' : 'No'}</Text>
                        </View>
                    </View>
                </View>
                { customer.notes ? (
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={[Styles.title, {textAlign: 'left'}]}>Description</Text>
                            <Text style={Styles.text}>{customer.notes}</Text>
                        </View>
                    </View>
                ) : null }
                { customer.status === 'REQUESTED' ? (
                    <View style={[Styles.block, {alignItems: 'center'}]}>
                            <View style={Styles.inputWrapper}>
                                <FontAwesome5 name="dollar-sign" size={24} style={Styles.icon} />
                                <TextInput
                                    style={Styles.input}
                                    placeholder='price'
                                    placeholderTextColor={Colors.text}
                                    value={price}
                                    onChangeText={setPrice}
                                    autoCapitalize='none'
                                />
                            </View>
                            <View style={Styles.inputWrapper}>
                                <FontAwesome5 name="clock" size={24} style={Styles.icon} />
                                <TextInput
                                    style={Styles.input}
                                    placeholder='estimated wait time (minutes)'
                                    placeholderTextColor={Colors.text}
                                    value={waitTime}
                                    onChangeText={setWaitTime}
                                    autoCapitalize='none'
                                />
                            </View>
                        <TouchableOpacity
                            style={Styles.actionButton}
                            onPress={async () => {
                                await sendPushNotification(customer.user.pushToken, 'Tow Request', 'Your tow request is ready!', data)
                                await handleUpdateTowRequest(client, customer.id ,'PENDING', price, waitTime);
                                navigate.reset({
                                    index: 1,
                                    routes: [
                                        { name: 'index' },
                                        { name: 'towRequests' }
                                    ]
                                });
                            }}
                        >
                            <Text style={Styles.actionText}>Respond</Text>
                        </TouchableOpacity>
                    </View>
                ) : customer.status === 'IN_PROGRESS' ? (
                    <View style={[Styles.block, {alignItems: 'center'}]}>
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
                                            onPress: async () => {
                                                await handleUpdateTowRequest(client, customer.id, 'COMPLETED');
                                                Alert.alert(
                                                    'Completed',
                                                    'Tow request has been marked as completed.',
                                                    [{ text: 'OK' }]
                                                );
                                                navigate.reset({
                                                    index: 1,
                                                    routes: [
                                                        { name: 'index' },
                                                        { name: 'towRequests' }
                                                    ]
                                                });
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
            </Background>
        </KeyboardAvoidingView>
    );
};

export default TowResponse;