import Colors from '../../constants/colors';
import { Background, BackgroundAlt, DropDownTab, SubTab, Tab } from '../../components/components';
import { formatDate, formatTime } from '../../constants/utils';
import { handleDeleteAppointment, handleGetMyAppointments, iconCheck } from '../../components/appointmentComponents';
import { useApp } from '../../hooks/useApp';
import { handleSendAdminNotif } from '../../components/notifComponents';
import { Styles } from '../../constants/styles';
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';

const MyAppointments = () => {
    const { client, userId, appointments, setAppointments } = useApp();

    useEffect(() => {
        const getAppointments = async () =>
        {
            const getAppointments = await handleGetMyAppointments(client, userId);
            setAppointments(getAppointments);
        }

        getAppointments();
    }, []);

    return (
        <>
            { appointments && appointments.length > 0 ? (
                <BackgroundAlt>
                    <FlatList
                        data={appointments}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <DropDownTab
                                    parentTab={(toggleExpand) => 
                                        <Tab
                                            header={formatDate(item?.date)}
                                            text={formatTime(item?.time)}
                                            leftIcon={iconCheck(item?.service)}
                                            rightIcon={
                                                <View style={[Styles.rightIcon, {flexDirection: 'row', columnGap: 10}]}>
                                                    <TouchableOpacity
                                                        style={{backgroundColor: Colors.button, padding: 10, borderRadius: 10}}
                                                        onPress={() => {
                                                            router.push({
                                                                params: { appointmentParam: JSON.stringify(item) },
                                                                pathname: 'schedule'
                                                            });
                                                        }}
                                                    >
                                                        <Entypo name='edit' size={25} color={Colors.accent}/>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={{backgroundColor: Colors.error, padding: 10, borderRadius: 10}}
                                                        onPress={() => {
                                                            Alert.alert(
                                                                'Cancel Appointment',
                                                                'Are you sure you would like to cancel your appointment?',
                                                                [
                                                                    { text: 'No' },
                                                                    {
                                                                        text: 'Yes',
                                                                        onPress: async () => {
                                                                            try {
                                                                                await handleDeleteAppointment(client, item?.id, userId, setAppointments);
                                                                                await handleSendAdminNotif('Appointment Cancelled', 'A customer has cancelled their appointment');
                                                                                if (router.canDismiss()) router.dismissAll();
                                                                                router.replace('(tabs)');
                                                                            } catch (error) {
                                                                                console.log(error);
                                                                            }
                                                                        }
                                                                    }
                                                                ]
                                                            )
                                                        }}
                                                    >
                                                        <Feather name='x' size={25} color={Colors.accent}/>
                                                    </TouchableOpacity>
                                                </View>
                                            }
                                            action={toggleExpand}
                                        />
                                    }
                                    childTabs={[
                                        <SubTab
                                            header='Service'
                                            text={item?.service}
                                            icon={iconCheck(item?.service)}
                                        />,
                                        <SubTab
                                            header='Vehicle'
                                            text={`${item.vehicle ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model} (${item.vehicle.color})` : `${item.vehicleYear} ${item.vehicleMake} ${item.vehicleModel} (${item.vehicleColor})`}`}
                                            icon={<Ionicons name="car-sport" size={30} style={Styles.icon}/>}
                                        />,
                                        item?.vehicle?.plate && (
                                            <SubTab
                                                header='License Plate #'
                                                text={`${item.vehicle ? `${item.vehicle.plate}` : `${item?.vehiclePlate}`}`}
                                                icon={<FontAwesome name='id-card' size={30} style={Styles.icon}/>}
                                            />
                                        ),
                                        item?.vehicle?.vin && (
                                            <SubTab
                                                header='VIN'
                                                text={`${item.vehicle ? `${item.vehicle.vin}` : `${item.vehicleVin}`}`}
                                                icon={<FontAwesome name='barcode' size={30} style={Styles.icon}/>}
                                            />
                                        )
                                    ].filter(Boolean)}
                                />
                            );
                        }}
                    />
                </BackgroundAlt>
            ) : (
                <Background>
                    <View style={[Styles.block, {alignItems: 'center'}]}>
                        <LottieView
                            source={require('../../assets/animations/calendarError.json')}
                            autoPlay={true}
                            loop={false}
                            style={{width: 200, height: 200}}
                            speed={0.5}
                        />
                        <Text style={Styles.title}>No Appointments</Text>
                    </View>
                </Background>
            )}
        </>
    );
};

export default MyAppointments;