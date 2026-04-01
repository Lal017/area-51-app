import Colors from '../../constants/colors';
import { BackgroundAlt, DropDownTab, Loading, SubTab, Tab } from '../../components/components';
import { handleDeleteVehicle, handleUpdateVehiclePickup } from '../../services/vehicleService';
import { useApp } from '../../hooks/useApp';
import { Styles } from '../../constants/styles';
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { handleDeleteAppointment } from '../../services/appointmentService';

const VehicleList = () =>
{
    const { client, userId, vehicles, setVehicles, appointments, setAppointments } = useApp();

    const [ pickupVehicles, setPickupVehicles ] = useState();
    const [ scheduledVehicles, setScheduledVehicles ] = useState();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const checkVehicles = async () =>
        {            
            // get Ids for appointments with vehicle pickup service and ready for pickup true
            const getScheduledVehicles = appointments
                ?.filter(appt => appt.service === 'Vehicle Pickup')
                .filter(appt => appt.vehicle.readyForPickup === true)
                .map(appt => ({
                    appointmentId: appt.id,
                    vehicleId: appt.vehicle.id
                }));

            // get Ids for readyForPickup = true
            const getReadyVehicles = vehicles
                ?.filter(vehicle => vehicle.readyForPickup === true)
                .map(vehicle => vehicle.id);

            const scheduledVehicleIds = getScheduledVehicles.map(appt => appt.vehicleId);
            const getPickupVehicles = getReadyVehicles?.filter(id => !scheduledVehicleIds.includes(id));

            setPickupVehicles(getPickupVehicles);
            setScheduledVehicles(getScheduledVehicles);
            setLoading(false);
        };

        checkVehicles();
    }, []);

    return(
        <>
        { !loading ? (
            <BackgroundAlt>
                {vehicles?.length > 0 ? (
                    <FlatList
                        data={vehicles}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => {
                            return(
                                <DropDownTab
                                    parentTab={(toggleExpand) =>
                                        <Tab
                                            header={`${item.year}`}
                                            text={`${item.make} ${item.model}`}
                                            action={toggleExpand}
                                            leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon} />}
                                            rightIcon={
                                                <View style={[Styles.rightIcon, {flexDirection: 'row', columnGap: 10}]}>
                                                    { scheduledVehicles?.some(appt => appt.vehicleId === item.id) ? (
                                                        <TouchableOpacity
                                                            style={{
                                                                backgroundColor: Colors.primary,
                                                                padding: 10,
                                                                paddingLeft: 35, paddingRight: 35,
                                                                borderRadius: 10,
                                                            }}
                                                            onPress={() => {
                                                                Alert.alert(
                                                                    'Vehicle Pickup',
                                                                    'Would you like to confirm that the vehicle has been picked up?',
                                                                    [
                                                                        { text: 'No' },
                                                                        {
                                                                            text: 'Yes',
                                                                            onPress: async () => {
                                                                                try {
                                                                                    setLoading(true);
                                                                                    await handleUpdateVehiclePickup(client, item.id, userId, setVehicles);
                                                                                    await handleDeleteAppointment(client, scheduledVehicles.find(vehicle => vehicle.vehicleId === item.id).appointmentId, userId, setAppointments);
                                                                                    router.dismissAll();
                                                                                    setLoading(false);
                                                                                } catch (error) {
                                                                                    console.log(error);
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                )
                                                            }}
                                                        >
                                                            <Entypo name='check' size={25} color={Colors.accent}/>
                                                        </TouchableOpacity>
                                                    ) : pickupVehicles?.includes(item.id) ? (
                                                        <TouchableOpacity
                                                            style={{
                                                                backgroundColor: Colors.secondary,
                                                                padding: 10,
                                                                paddingLeft: 35, paddingRight: 35,
                                                                borderRadius: 10,
                                                            }}
                                                            onPress={() => router.push('vehiclePickup')}
                                                        >
                                                            <AntDesign name='calendar' size={25} color={Colors.accent}/>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <>
                                                            <TouchableOpacity
                                                                style={{backgroundColor: Colors.button, padding: 10, borderRadius: 10}}
                                                                onPress={() => {
                                                                    router.push({
                                                                        pathname: 'vehicleEdit',
                                                                        params: { vehicleParam: JSON.stringify(item) }
                                                                    });
                                                                }}
                                                            >
                                                                <Entypo name='edit' size={25} color={Colors.accent}/>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={{backgroundColor: Colors.error, padding: 10, borderRadius: 10}}
                                                                onPress={() => {
                                                                    Alert.alert(
                                                                        'Delete Vehicle',
                                                                        'Are you sure you want to delete this vehicle?',
                                                                        [
                                                                            { text: 'No' },
                                                                            {
                                                                                text: 'Yes',
                                                                                onPress: async () => {
                                                                                    await handleDeleteVehicle(client, item.id, setVehicles);
                                                                                    router.dismissAll();
                                                                                    router.push('vehicleList');
                                                                                }
                                                                            }
                                                                        ]
                                                                    );
                                                                }}
                                                            >
                                                                <Feather name='x' size={25} color={Colors.accent}/>
                                                            </TouchableOpacity>
                                                        </>
                                                    )}
                                                </View>
                                            }
                                        />
                                    }
                                    childTabs={[
                                        <SubTab
                                            header='Vehicle Color'
                                            text={`${item.color}`}
                                            icon={<FontAwesome name='paint-brush' size={25} style={Styles.icon}/> }
                                        />,
                                        item?.plate && (
                                            <SubTab
                                                header='License Plate #'
                                                text={`${item.plate}`}
                                                icon={<FontAwesome name='id-card' size={25} style={Styles.icon}/>}
                                            />
                                        ),
                                        item?.vin && (
                                            <SubTab
                                                header='VIN'
                                                text={`${item.vin}`}
                                                icon={<FontAwesome name='barcode' size={25} style={Styles.icon}/> }
                                            />
                                        )
                                    ].filter(Boolean)}
                                />
                            );
                        }}
                        style={{flexGrow: 0}}
                    />
                ) : (
                    <Tab
                        text='No Vehicles'
                        leftIcon={<MaterialCommunityIcons name="cancel" size={30} style={Styles.icon} />}    
                    />
                )}
                <Tab
                    text='Add'
                    action={() => router.push('vehicleAdd')}
                    leftIcon={<Ionicons name="add-circle" size={30} style={Styles.icon} />}
                    rightIcon={<AntDesign name="right" size={25} style={Styles.rightIcon} />}  
                />
            </BackgroundAlt>
        ) : (<Loading/>)}
        </>
    );
};

export default VehicleList;