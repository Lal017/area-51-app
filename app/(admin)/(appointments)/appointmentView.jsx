import Colors from '../../../constants/colors';
import { Styles, TowStyles, AdminStyles } from '../../../constants/styles';
import { handleUpdateVehiclePickupStatus } from '../../../components/vehicleComponents';
import { formatNumber, formatDate, formatTime, Background } from '../../../components/components';
import { sendPushNotification } from '../../../components/notifComponents';
import { router, useLocalSearchParams } from 'expo-router';
import { openURL } from 'expo-linking';
import { Entypo } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useApp } from '../../../components/context';
import { useNavigation } from '@react-navigation/native';

const AppointmentView = () =>
{
    const { appointmentParam } = useLocalSearchParams();
    const appointment = JSON.parse(appointmentParam);
    const { client } = useApp();
    const navigate = useNavigation();

    const [ loading, setLoading ] = useState(false);

    const openCallCustomer = (phone) =>
    {
        const url = `tel:${phone}`;
        openURL(url);
    };

    return (
        <Background>
            <View style={Styles.block}>
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <Text style={Styles.subTitle}>Customer</Text>
                    <Text style={Styles.text}>{appointment?.user?.firstName} {appointment?.user?.lastName} | {formatNumber(appointment?.user?.phone)} | {appointment?.user?.email}</Text>
                </View>
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <Text style={Styles.subTitle}>Appointment Details</Text>
                    <Text style={Styles.text}>{formatDate(appointment?.date)}   |   {formatTime(appointment?.time)}</Text>
                    <Text style={Styles.text}>{appointment?.service}</Text>
                </View>
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <Text style={Styles.subTitle}>Vehicle</Text>
                    <Text style={Styles.text}>{appointment?.vehicle?.year} {appointment?.vehicle?.make} {appointment?.vehicle?.model} ({appointment?.vehicle?.color})</Text>
                    { appointment?.vehicle?.plate ? (    
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.text}>Plate:</Text>
                            <Text style={Styles.text}>{appointment?.vehicle?.plate}</Text>
                        </View>
                    ) : null }
                    { appointment?.vehicle?.vin ? (
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.text}>VIN:</Text>
                            <Text style={Styles.text}>{appointment?.vehicle?.vin}</Text>
                        </View>
                    ) : null }
                </View>
                { appointment?.notes ? (
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Notes</Text>
                        <Text style={Styles.text}>{appointment?.notes}</Text>
                    </View>
                ) : null }
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Pickup Status</Text>
                        <Text style={[Styles.text, appointment?.vehicle.readyForPickup ? {color: 'green'} : {color: 'red'}]}>{ appointment?.vehicle.readyForPickup ? 'Ready for pickup' : 'Not ready for pickup'}</Text>
                    </View>
                </View>
            </View>
            <View style={Styles.block}>
                <View style={TowStyles.dualButtonContainer}>
                    <TouchableOpacity
                        style={[TowStyles.button, {backgroundColor: Colors.button, columnGap: 5}]}
                        onPress={() => openCallCustomer(appointment?.user?.phone)}
                    >
                        <Entypo name="phone" size={25} color='white'/>
                        <Text style={Styles.actionText}>Call Customer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[TowStyles.button, {backgroundColor: Colors.button}, loading && {opacity: 0.5}]}
                        onPress={() => {
                            Alert.alert(
                                'Confirmation',
                                'Mark the vehicle as ready for pickup?',
                                [
                                    { text: 'No' },
                                    {
                                        text: 'Yes',
                                        onPress: async () => {
                                            let title = !appointment?.vehicle.readyForPickup ? 'Vehicle Pickup' : 'Vehicle Picked Up';
                                            let body = !appointment?.vehicle.readyForPickup ? `Your ${appointment?.vehicle.year} ${appointment?.vehicle.make} ${appointment?.vehicle.model} is ready for pickup!` : `Your ${appointment?.vehicle.year} ${appointment?.vehicle.make} ${appointment?.vehicle.model} has been picked up!`;
                                            const data = {
                                                type: "VEHICLE_PICKUP"
                                            };
                                            await handleUpdateVehiclePickupStatus(client, appointment?.vehicle?.id, !appointment?.vehicle?.readyForPickup);
                                            await sendPushNotification(appointment?.user.pushToken, title, body, data);
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
                        <Text style={Styles.actionText}>{appointment?.vehicle.readyForPickup ? 'Completed' : 'Set Ready for pickup'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Background>
    );
};

export default AppointmentView;