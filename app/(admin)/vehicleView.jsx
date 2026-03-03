import Colors from '../../constants/colors';
import { Background, formatNumber, Tab, callCustomer, textCustomer } from '../../components/components';
import { Styles } from '../../constants/styles';
import { handleUpdateVehiclePickupStatus } from '../../components/vehicleComponents';
import { sendPushNotification } from '../../components/notifComponents';
import { useApp } from '../../components/context';
import { View, Text, Alert, Switch, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Entypo, Ionicons, FontAwesome } from '@expo/vector-icons';

const VehicleView = () =>
{
    const { vehicleParam } = useLocalSearchParams();
    const vehicle = JSON.parse(vehicleParam);

    const { client } = useApp();

    const [ loading, setLoading ] = useState(false);
    const [ isReady, setIsReady ] = useState(vehicle?.readyForPickup);

    return (
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.headerTitle}>{vehicle?.user?.firstName} {vehicle?.user?.lastName}</Text>
                    <Text style={Styles.tabHeader}>{vehicle?.user?.email}</Text>
                    <Text style={Styles.tabHeader}>{formatNumber(vehicle?.user?.phone)}</Text>
                </View>
                <View style={[Styles.rightIcon, {flexDirection: 'row', columnGap: 10}]}>
                    <TouchableOpacity
                        style={{padding: 5, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => callCustomer(vehicle?.user?.phone)}
                    >
                        <Entypo name='phone' size={30} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{padding: 5, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => textCustomer(vehicle?.user?.phone)}
                    >
                        <Entypo name='message' size={30} color='white'/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={Styles.floatingBlock}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.headerTitle}>Vehicle</Text>
                    <Tab
                        header={`${vehicle.year}`}
                        text={`${vehicle.make} ${vehicle.model}`}
                        leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon}/>}
                    />
                    <Tab
                        header='Vehicle Color'
                        text={`${vehicle.color}`}
                        leftIcon={<FontAwesome name='paint-brush' size={25} style={Styles.icon}/> }
                        style={{height: 'none', padding: 5}}
                    />
                    { vehicle?.plate && (
                        <Tab
                            header='License Plate #'
                            text={`${vehicle.plate}`}
                            leftIcon={<FontAwesome name='id-card' size={25} style={Styles.icon}/>}
                            style={{height: 'none', padding: 5}}
                        />
                    )}
                    { vehicle?.vin && (
                        <Tab
                            header='VIN'
                            text={`${vehicle.vin}`}
                            leftIcon={<FontAwesome name='barcode' size={25} style={Styles.icon}/> }
                            style={{height: 'none', padding: 5}}
                        />
                    )}
                </View>
            </View>
            <View style={[Styles.block, {paddingTop: 20}]}>
                <View style={{
                    flexDirection: 'row',
                    paddingLeft: 20,
                    columnGap: 10
                }}>
                    <Switch
                        value={isReady}
                        onValueChange={(val) => {
                            Alert.alert(
                                'Confirmation',
                                'Mark the vehicle as ready for pickup?',
                                [
                                    { text: 'No' },
                                    {
                                        text: 'Yes',
                                        onPress: async () => {
                                            if (loading) return;
                                            setLoading(true);
                                            let title = val ? 'Vehicle Pickup' : 'Vehicle Picked Up';
                                            let body = val ? `Your ${vehicle.year} ${vehicle.make} ${vehicle.model} is ready for pickup!` : `Your ${vehicle.year} ${vehicle.make} ${vehicle.model} has been picked up!`;
                                            const data = {
                                                type: "VEHICLE_PICKUP"
                                            };
                                            await handleUpdateVehiclePickupStatus(client, vehicle.id, val);
                                            setIsReady(val);
                                            await sendPushNotification(vehicle.user.pushToken, title, body, data);
                                            setLoading(false);
                                        }
                                    }
                                ]
                            );
                        }}
                        trackColor={{ false: Colors.backDropAccent, true: Colors.backDropAccent}}
                        thumbColor={isReady ? Colors.primary : Colors.redButton }
                    />
                    <View>
                        <Text style={Styles.headerTitle}>{isReady ? 'Ready' : 'Not Ready'}</Text>
                        <Text style={Styles.tabHeader}>{isReady ? 'Vehicle is ready for pick up' : 'Vehicle is not ready for pickup'}</Text>
                    </View>
                </View>
            </View>
        </Background>
    );
};

export default VehicleView;