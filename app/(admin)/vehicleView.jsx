import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Background, formatNumber } from '../../components/components';
import { useLocalSearchParams, router } from 'expo-router';
import { AdminStyles, Styles } from '../../constants/styles';
import Colors from '../../constants/colors';
import { useState } from 'react';
import { handleUpdateVehicleStatus, sendPushNotification } from '../../components/adminComponents';
import { useApp } from '../../components/context';

const VehicleView = () =>
{
    const { vehicleParam } = useLocalSearchParams();
    const vehicle = JSON.parse(vehicleParam);

    const { client } = useApp();

    const [ loading, setLoading ] = useState(false);

    const data = {
        type: "VEHICLE_PICKUP"
    };

    return (
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.title}>Vehicle</Text>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Year</Text>
                        <Text style={Styles.text}>{vehicle.year}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Make</Text>
                        <Text style={Styles.text}>{vehicle.make}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Model</Text>
                        <Text style={Styles.text}>{vehicle.model}</Text>
                    </View>
                    { vehicle?.color ? (
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Color</Text>
                            <Text style={Styles.text}>{vehicle.color}</Text>
                        </View>
                    ) : null}
                    { vehicle?.plate ? (
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Plate</Text>
                            <Text style={Styles.text}>{vehicle.plate}</Text>
                        </View>
                    ) : null}
                    { vehicle?.vin ? (
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>VIN</Text>
                            <Text style={Styles.text}>{vehicle.vin}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.title}>User</Text>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Name</Text>
                        <Text style={Styles.text}>{vehicle.user.firstName} {vehicle.user.lastName}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Email</Text>
                        <Text style={Styles.text}>{vehicle.user.email}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Phone Number</Text>
                        <Text style={Styles.text}>{formatNumber(vehicle.user.phone)}</Text>
                    </View>
                </View>
            </View>
            <View style={[Styles.block, {alignItems: 'center'}]}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.title}>Pickup</Text>
                    <Text style={Styles.text}>Let the customer know their vehicle is ready for pickup</Text>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Status</Text>
                        <Text style={[Styles.text, vehicle.readyForPickup ? {color: 'green'} : {color: 'red'}]}>{ vehicle.readyForPickup ? 'Ready for pickup' : 'Not ready for pickup'}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[Styles.actionButton, vehicle.readyForPickup && {backgroundColor: Colors.primary }, loading && {opacity: 0.7}]}
                    onPress={() => Alert.alert(
                        'Confirm',
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
                                    await handleUpdateVehicleStatus(client, vehicle.id, !vehicle.readyForPickup);
                                    await sendPushNotification(vehicle.user.pushToken, title, body, data);
                                    router.replace('(admin)');
                                    setLoading(false);
                                }
                            }
                        ]
                    )}
                    disabled={loading}
                >
                    <Text style={Styles.actionText}>{ vehicle.readyForPickup ? 'Finished' : 'Ready for pickup'}</Text>
                </TouchableOpacity>
            </View>
        </Background>
    );
};

export default VehicleView;