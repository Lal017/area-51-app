import { Background, SimpleList, Tab } from '../../components/components';
import { useApp } from '../../components/context';
import { Styles } from '../../constants/styles';
import { handleUpdateVehiclePickup } from '../../components/vehicleComponents';
import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const VehiclePickup = () =>
{
    const { client, vehicles } = useApp();
    const [ vehiclesToPickup, setVehiclesToPickup ] = useState();
    const [ loading, setLoading ] = useState(false);

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
                <View style={Styles.infoContainer}>
                    <Text style={Styles.headerTitle}>Hours of operation</Text>
                    <Text style={Styles.tabHeader}>Mon - Fri | 9am - 5:30pm</Text>
                </View>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.tabHeader}>The following vehicle(s) are ready for pickup!</Text>
                </View>
            </View>
            <View style={Styles.block}>
                <SimpleList
                    data={vehiclesToPickup}
                    renderItem={({item}) =>
                        <>
                            <View style={Styles.infoContainer}>
                                <Tab
                                    header={`${item.year}`}
                                    text={`${item.make} ${item.model}`}
                                    leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon}/>}
                                />
                                <Tab
                                    header='Vehicle Color'
                                    text={`${item.color}`}
                                    leftIcon={<FontAwesome name='paint-brush' size={25} style={Styles.icon}/>}
                                    style={{marginLeft: 50}}
                                />
                                { item.plate && (
                                    <Tab
                                        header='License Plate #'
                                        text={`${item.plate}`}
                                        leftIcon={<FontAwesome name='id-card' size={25} style={Styles.icon}/>}
                                        style={{marginLeft: 50}}
                                    />
                                )}
                                { item.vin && (
                                    <Tab
                                        header='VIN'
                                        text={`${item.vin}`}
                                        leftIcon={<FontAwesome name='barcode' size={25} style={Styles.icon}/>}
                                        style={{marginLeft: 50}}
                                    />
                                )}
                            </View>
                            <TouchableOpacity
                                style={[Styles.actionButton, {alignSelf: 'center'}]}
                                onPress={async () => {
                                    if (loading) return;
                                    setLoading(true);
                                    await handleUpdateVehiclePickup(client, vehicle.id);
                                    router.replace('(tabs)');
                                    setLoading(false);
                                }}
                            >
                                <Text style={Styles.actionText}>Mark as Picked Up</Text>
                            </TouchableOpacity>
                        </>
                    }
                />
            </View>
        </Background>
    );
};

export default VehiclePickup;