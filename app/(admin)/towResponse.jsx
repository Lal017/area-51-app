import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Styles, AdminStyles } from '../../constants/styles';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { sendPushNotification } from '../../components/adminComponents';
import { useState } from 'react';
import { handleUpdateTowRequest } from '../../components/adminComponents';
import { useApp } from '../../components/context';
import { formatNumber } from '../../components/components';

const TowResponse = () =>
{
    const { client } = useApp();
    const { customerParam } = useLocalSearchParams();
    const customer = JSON.parse(customerParam);

    const [ price, setPrice ] = useState();
    const [ waitTime, setWaitTime ] = useState();

    const data = {
        type: "TOW_RESPONSE"
    };

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
                ) : null }
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default TowResponse;