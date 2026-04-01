import Colors from '../../constants/colors';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActionButton, Background, ErrorDisplay, SimpleList, Tab } from '../../components/components';
import { useApp } from '../../hooks/useApp';
import { ServiceStyles, Styles } from '../../constants/styles';
import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { handleSendAdminNotif } from '../../components/notifComponents';
import { handleCreateAppointment } from '../../components/appointmentComponents';
import { textSize, formatDate, formatTime } from '../../constants/utils';

const VehiclePickup = () =>
{
    const { client, vehicles, setVehiclePickup, userId, appointments, setAppointments } = useApp();
    const [ vehiclesToPickup, setVehiclesToPickup ] = useState();
    const [ errorMessage, setErrorMessage ] = useState(undefined);
    const [ date, setDate ] = useState(new Date());
    const [ time, setTime ] = useState(undefined);
    
    const TIME_SLOTS = [ '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00', '16:30:00', '17:00:00', '17:30:00' ];

    const isToday = date.toLocaleDateString('sv-SE') === new Date().toLocaleDateString('sv-SE');
    const currentTime = new Date().toTimeString().slice(0, 8);

    const availableSlots = isToday ? TIME_SLOTS.filter(slot => slot >= currentTime) : TIME_SLOTS;

    const bottomSheetRef = useRef(null);

    const snapPoints = useMemo(() => ['25%', '60%', '80%'], []);
    const handleClosePress = () => bottomSheetRef.current?.close();
    const handleOpenPress = () => bottomSheetRef.current?.snapToIndex(2);

    useEffect(() => {
        const initVehicles = async () =>
        {
            // filter vehicles out that already have a scheduled pickup date
            const scheduledVehicles = appointments
                ?.filter(appt => appt.service === 'Vehicle Pickup')
                .map(appt => appt.vehicle?.id);

            // filter vehicles only if they have been set to ready for pickup
            const getVehicles = vehicles
                ?.filter(item => item.readyForPickup === true)
                .filter(item => !scheduledVehicles?.includes(item.id));

            setVehiclesToPickup(getVehicles);
        }

        initVehicles();
    }, [vehicles]);

    const showDateMode = () =>
    {
        DateTimePickerAndroid.open({
            value: date,
            display: 'spinner',
            onChange: (_, selectedDate) => {
                if (selectedDate?.toLocaleDateString('sv-SE') !== date?.toLocaleDateString('sv-SE'))
                {
                    setDate(selectedDate);
                    setTime(undefined);
                }
            },
            minimumDate: new Date(),
            mode: 'date'
        });
    };

    return(
        <GestureHandlerRootView>
            <Background>
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.headerTitle}>Hours of operation</Text>
                        <Text style={Styles.tabHeader}>Mon - Fri | 9 AM - 5:30 PM</Text>
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
                                        leftIcon={<FontAwesome name='paint-brush' size={20} style={Styles.icon}/>}
                                        style={{height: 'none', padding: 5}}
                                    />
                                    { item.plate && (
                                        <Tab
                                            header='License Plate #'
                                            text={`${item.plate}`}
                                            leftIcon={<FontAwesome name='id-card' size={20} style={Styles.icon}/>}
                                            style={{height: 'none', padding: 5}}
                                        />
                                    )}
                                    { item.vin && (
                                        <Tab
                                            header='VIN'
                                            text={`${item.vin}`}
                                            leftIcon={<FontAwesome name='barcode' size={20} style={Styles.icon}/>}
                                            style={{height: 'none', padding: 5}}
                                        />
                                    )}
                                </View>
                                <View style={Styles.block}>
                                    <View style={Styles.infoContainer}>
                                        <Text style={Styles.headerTitle}>Schedule Pickup</Text>
                                        <Text style={Styles.tabHeader}>Set a date and time to pickup your vehicle</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center'}}>
                                        <TouchableOpacity
                                            style={ServiceStyles.timeSelectContainer}
                                            onPress={showDateMode}
                                        >
                                            <LinearGradient
                                                colors={[Colors.button, Colors.backgroundContrast]}
                                                style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}
                                                start={{ x: 0, y: 0}}
                                                end={{ x: 1, y: 1}}
                                            />
                                            <FontAwesome6 name='caret-down' size={25} style={Styles.rightIcon}/>
                                            <Text style={[Styles.text, {fontSize: textSize(13)}]}>{formatDate(date.toLocaleDateString('sv-SE'))}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={ServiceStyles.timeSelectContainer}
                                            onPress={() => {
                                                setErrorMessage(undefined);
                                                handleOpenPress();
                                            }}
                                        >
                                            <LinearGradient
                                                colors={[Colors.button, Colors.backgroundContrast]}
                                                style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}
                                                start={{ x: 0, y: 0}}
                                                end={{ x: 1, y: 1}}
                                            />
                                            <FontAwesome6 name='caret-down' size={25} style={Styles.rightIcon}/>
                                            <Text style={[Styles.text, {fontSize: textSize(13)}]}>{time ? formatTime(time) : 'Select a Time'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    { errorMessage && (
                                        <ErrorDisplay message={errorMessage}/>
                                    )}
                                    <ActionButton
                                        text='Schedule Pickup'
                                        primaryColor={Colors.secondary}
                                        secondaryColor={Colors.secondaryShade}
                                        onPress={async () => {
                                            try {
                                                await handleSendAdminNotif('Pickup Scheduled', 'A customer has scheduled a vehicle pickup');
                                                const newAppointments = await handleCreateAppointment({client, date: date?.toLocaleDateString('sv-SE'), time, service: 'Vehicle Pickup', userId, vehicle: item, setAppointments});
                                                // get vehicleIds that have an appointment scheduled for pickup
                                                const scheduledVehiclePickups = newAppointments
                                                    ?.filter(appt => appt.service === 'Vehicle Pickup')
                                                    .map(appt => appt.vehicle?.id);
                                                // filter out vehicles that already have a scheduled pickup appointment
                                                const filterVehicles = vehicles?.some(item => item.readyForPickup === true && !scheduledVehiclePickups.includes(item.id));
                                                setVehiclePickup(filterVehicles);
                                                router.dismissAll();
                                            } catch (error) {
                                                console.error(error);
                                            }
                                        }}
                                    />
                                </View>
                            </>
                        }
                    />
                </View>
            </Background>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                backgroundStyle={{ backgroundColor: Colors.button}}
                enableDynamicSizing={false}
            >
                <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <LinearGradient
                        colors={[Colors.button, Colors.contrast]}
                        style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}
                        start={{ x: 0, y: 0}}
                        end={{ x: 0, y: 1}}
                    />
                    <View style={[Styles.block, {paddingTop: 20}]}>
                        <View style={ServiceStyles.timeContainer}>
                            { availableSlots.length > 0 ? (
                                <SimpleList
                                    data={availableSlots}
                                    renderItem={({item}) =>
                                        <TouchableOpacity
                                            onPress={() => setTime(item)}
                                            style={[
                                            {
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                borderRadius: 5,
                                                padding: 10,
                                                width: '45%'
                                            },
                                            time === item && {
                                                backgroundColor: Colors.contrast
                                            }
                                            ]}
                                        >
                                            <Text style={[Styles.text, time === item && {color: Colors.textAlt}, { textAlign: 'center' }]}>{formatTime(item)}</Text>
                                        </TouchableOpacity>
                                    }
                                />
                            ) : (
                                <View style={Styles.block}>
                                    <Text style={[Styles.headerTitle, {textAlign: 'center'}]}>No Available Times</Text>
                                </View>
                            )}
                        </View>
                        <ActionButton
                            text='Done'
                            onPress={async () => handleClosePress()}
                        />
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

export default VehiclePickup;