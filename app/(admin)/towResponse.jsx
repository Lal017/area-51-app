import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Styles, AdminStyles } from '../../constants/styles';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { sendPushNotification } from '../../components/adminComponents';
import { useState } from 'react';
import { handleUpdateTowRequest } from '../../components/adminComponents';
import { useApp } from '../../components/context';

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
        <View style={Styles.page}>
            <View style={AdminStyles.vehicleBox}>
                <Text style={Styles.subTitle}>{customer.vehicle.year}</Text>
                <Text style={Styles.subTitle}>{customer.vehicle.make}</Text>
                <Text style={Styles.subTitle}>{customer.vehicle.model}</Text>
            </View>
            <View style={AdminStyles.notesBox}>
                <Text style={Styles.subTitle}>{customer.notes}</Text>
            </View>
            <View style={AdminStyles.responseContainer}>
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
        </View>
    );
};

export default TowResponse;