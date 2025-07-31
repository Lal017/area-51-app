import { Background } from '../../components/components';
import { useApp } from '../../components/context';
import { Styles } from '../../constants/styles';
import { handleUpdateVehiclePickup } from '../../components/vehicleComponents';
import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const VehiclePickup = () =>
{
    const { client, vehicles } = useApp();
    const [ vehiclesToPickup, setVehiclesToPickup ] = useState();
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigation();

    useEffect(() => {
        const initVehicles = () =>
        {
            const getVehicles = vehicles?.filter(item => item.readyForPickup === true);
            setVehiclesToPickup(getVehicles);
        }

        initVehicles();
    }, [vehicles]);

    return(
        <Background>
            <View style={Styles.block}>
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <Text style={Styles.subTitle}>Location</Text>
                    <Text style={Styles.text}>3120 W Sirius Ave. #103 Las Vegas, NV 89102</Text>
                </View>
                <View style={[Styles.infoContainer, {rowGap: 0}]}>
                    <Text style={Styles.subTitle}>Hours of operation</Text>
                    <Text style={Styles.text}>Mon - Fri | 9am - 5:30pm</Text>
                </View>
                <View style={[Styles.infoContainer, {rowGap: 5}]}>
                    <Text style={Styles.subTitle}>{ vehiclesToPickup?.length > 1 ? 'Vehicles' : 'Vehicle'}</Text>
                    { vehiclesToPickup?.map((vehicle, index) => (
                        <View style={{rowGap: 15}} key={index}>
                            <Text style={Styles.text}>{vehicle?.year} {vehicle?.make} {vehicle?.model} ({vehicle?.color})</Text>
                            <TouchableOpacity
                                style={[Styles.actionButton, {alignSelf: 'center'}]}
                                onPress={async () => {
                                    if (loading) return;
                                    setLoading(true);
                                    await handleUpdateVehiclePickup(client, vehicle.id);
                                    navigate.reset({
                                        index: 0,
                                        routes: [{ name: '(tabs)' }]
                                    });
                                    setLoading(false);
                                }}
                            >
                                <Text style={Styles.actionText}>Mark as Picked Up</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        </Background>
    );
};

export default VehiclePickup;