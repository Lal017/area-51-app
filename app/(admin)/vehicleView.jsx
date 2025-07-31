import Colors from '../../constants/colors';
import { Background, formatNumber } from '../../components/components';
import { AdminStyles, Styles } from '../../constants/styles';
import { handleUpdateVehiclePickupStatus } from '../../components/vehicleComponents';
import { sendPushNotification } from '../../components/notifComponents';
import { useApp } from '../../components/context';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const VehicleView = () =>
{
    const { vehicleParam } = useLocalSearchParams();
    const vehicle = JSON.parse(vehicleParam);
    const navigate = useNavigation();

    const { client } = useApp();

    const [ loading, setLoading ] = useState(false);

    return (
        <Background>
            <View style={Styles.block}>
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <Text style={Styles.subTitle}>Customer</Text>
                    <Text style={Styles.text}>{vehicle?.user?.firstName} {vehicle?.user?.lastName} | {formatNumber(vehicle?.user?.phone)} | {vehicle?.user?.email}</Text>
                </View>
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <Text style={Styles.subTitle}>Vehicle</Text>
                    <Text style={Styles.text}>{vehicle?.year} {vehicle?.make} {vehicle?.model} ({vehicle?.color})</Text>
                    { vehicle?.plate || vehicle?.vin ? <Text style={Styles.text}>{vehicle?.plate}{vehicle?.plate && vehicle?.vin ? ' | ' : null}{vehicle?.vin}</Text> : null }
                </View>
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <Text style={Styles.subTitle}>Pickup</Text>
                    <Text style={Styles.text}>Let the customer know their vehicle is ready for pickup</Text>
                </View>
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Pickup Status</Text>
                        <Text style={[Styles.text, vehicle.readyForPickup ? {color: 'green'} : {color: 'red'}]}>{ vehicle.readyForPickup ? 'Ready for pickup' : 'Not ready for pickup'}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[Styles.actionButton, {backgroundColor: Colors.button}, {alignSelf: 'center'}, vehicle.readyForPickup && {backgroundColor: Colors.button }, loading && {opacity: 0.7}]}
                    onPress={() => Alert.alert(
                        'Confirmation',
                        'Mark the vehicle as ready for pickup?',
                        [
                            { text: 'No' },
                            {
                                text: 'Yes',
                                onPress: async () => {
                                    if (loading) return;
                                    setLoading(true);
                                    let title = !vehicle.readyForPickup ? 'Vehicle Pickup' : 'Vehicle Picked Up';
                                    let body = !vehicle.readyForPickup ? `Your ${vehicle.year} ${vehicle.make} ${vehicle.model} is ready for pickup!` : `Your ${vehicle.year} ${vehicle.make} ${vehicle.model} has been picked up!`;
                                    const data = {
                                        type: "VEHICLE_PICKUP"
                                    };
                                    await handleUpdateVehiclePickupStatus(client, vehicle.id, !vehicle.readyForPickup);
                                    await sendPushNotification(vehicle.user.pushToken, title, body, data);
                                    navigate.reset({
                                        index: 1,
                                        routes: [
                                            { name: 'index' },
                                            { name: 'vehicleList' }
                                        ]
                                    });
                                    setLoading(false);
                                }
                            }
                        ]
                    )}
                    disabled={loading}
                >
                    <Text style={Styles.actionText}>{ vehicle.readyForPickup ? 'Completed' : 'Ready for pickup'}</Text>
                </TouchableOpacity>
            </View>
        </Background>
    );
};

export default VehicleView;