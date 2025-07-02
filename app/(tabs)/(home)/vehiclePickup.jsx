import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Background } from '../../../components/components';
import { useEffect, useState } from 'react';
import { useApp } from '../../../components/context';
import { HomeStyles, Styles } from '../../../constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { handleUpdateVehicleStatus } from '../../../components/vehicleComponents';

const VehiclePickup = () =>
{
    const { client, vehicles, setVehicles } = useApp();
    const [ vehiclePickup, setVehiclePickup ] = useState();
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const initVehicles = () =>
        {
            const getVehicles = vehicles?.filter(item => item.readyForPickup === true);
            console.log(getVehicles);
            setVehiclePickup(getVehicles);
        }

        initVehicles();
    }, [vehicles]); 
    return(
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.title}>Ready for Pickup</Text>
                    <Text style={Styles.text}>The following vehicles are ready to be picked up.</Text>
                </View>
            </View>
            <View style={[Styles.block, {rowGap: 5, alignItems: 'center'}]}>
                { vehiclePickup?.map((vehicle, index) => (
                    <View style={HomeStyles.pickupContainer} key={index}>
                        <View style={HomeStyles.pickupInfo}>
                            <Ionicons name='car-sport' size={30} color='white'/>
                            <Text style={Styles.text}>{vehicle.year} {vehicle.make} {vehicle.model}</Text>
                        </View>
                        <TouchableOpacity
                            style={Styles.actionButton}
                            onPress={() => Alert.alert(
                                'Confirm',
                                'Has your vehicle been picked up?',
                                [
                                    { text: 'No'},
                                    {
                                        text: 'Yes',
                                        onPress: async () => {
                                            if (loading) return;
                                            setLoading(true);
                                            await handleUpdateVehicleStatus(client, vehicle.id, setVehicles);
                                            router.replace('(tabs)/(home)');
                                            setLoading(false);
                                        }
                                    }
                                ]
                            )}
                        >
                            <Text style={Styles.actionText}>Vehicle has been picked up</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.subTitle}>Reminder</Text>
                    <Text style={Styles.text}>3120 W Sirius Ave. #103 Las Vegas, NV 89102</Text>
                    <Text style={Styles.text}>Mon - Fri | 9am - 5:30pm</Text>
                </View>
            </View>
        </Background>
    );
};

export default VehiclePickup;