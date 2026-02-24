import Colors from '../../../constants/colors';
import { Background, BackgroundAlt, formatDate, formatTime, Tab } from '../../../components/components';
import { handleDeleteAppointment, handleGetMyAppointments } from '../../../components/appointmentComponents';
import { useApp } from '../../../components/context';
import { handleSendAdminNotif } from '../../../components/notifComponents';
import { Styles } from '../../../constants/styles';
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Entypo, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

const MyAppointments = () => {
    const { client, userId, appointments, setAppointments } = useApp();
    const navigate = useNavigation();

    useEffect(() => {
        const getAppointments = async () =>
        {
            const getAppointments = await handleGetMyAppointments(client, userId);
            setAppointments(getAppointments);
        }

        getAppointments();
    }, []);
    
    const iconCheck = (service, isRight) =>
    {
        switch (service) {
            case 'Oil Change':
                return <FontAwesome5 name="oil-can" size={30} style={isRight ? Styles.rightIcon : Styles.icon} color={Colors.backDrop}/>;
            case 'Diagnosis':
                return <FontAwesome name="stethoscope" size={30} style={isRight ? Styles.rightIcon : Styles.icon} color={Colors.backDrop}/>;
            case 'Tuning':
                return <Entypo name="area-graph" size={30} style={isRight ? Styles.rightIcon : Styles.icon} color={Colors.backDrop}/>;
            case 'A/C':
                return <MaterialIcons name="air" size={30} style={isRight ? Styles.rightIcon : Styles.icon} color={Colors.backDrop}/>;
            default:
                return <MaterialCommunityIcons name="dots-horizontal-circle" size={30} style={isRight ? Styles.rightIcon : Styles.icon} color={Colors.backDrop}/>;
        }
    };

    const AppointmentItem = ({ item }) =>
    {
        const expandedHeight = useSharedValue(0);
        const toggleExpand = () => expandedHeight.value = expandedHeight.value === 0 ? 500 : 0;

        const animatedStyle = useAnimatedStyle(() => ({
            maxHeight: withSpring(expandedHeight.value),
            overflow: 'hidden'
        }));
    
        return (
            <>
                <Tab
                    header={formatDate(item?.date)}
                    text={formatTime(item?.time)}
                    leftIcon={iconCheck(item?.service, false)}
                    rightIcon={
                        <View style={[Styles.rightIcon, {flexDirection: 'row', columnGap: 10}]}>
                            <TouchableOpacity
                                style={{backgroundColor: Colors.button, padding: 10, borderRadius: 10}}
                                onPress={() => {
                                    router.push({
                                        params: { appointmentParam: JSON.stringify(item) },
                                        pathname: '/(tabs)/(service)/editAppointment'
                                    });
                                }}
                            >
                                <Entypo name='edit' size={25} color={Colors.backDropAccent}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{backgroundColor: Colors.redButton, padding: 10, borderRadius: 10}}
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
                                                        navigate.reset({
                                                            index: 0,
                                                            routes: [{ name: '(home)' }]
                                                        });
                                                    } catch (error) {
                                                        console.log(error);
                                                    }
                                                }
                                            }
                                        ]
                                    )
                                }}
                            >
                                <Feather name='x' size={25} color={Colors.backDropAccent}/>
                            </TouchableOpacity>
                        </View>
                    }
                    action={toggleExpand}
                />
                <Animated.View style={animatedStyle}>
                    <>
                        <Tab
                            header='Service'
                            text={item?.service}
                            rightIcon={iconCheck(item?.service, true)}
                            style={{height: 'none', paddingBottom: 5}}
                        />
                        <Tab
                            header={`Vehicle${item?.vehicle?.plate ? ` (${item.vehicle.plate})` : ``}`}
                            text={`${item.vehicle ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}` : `${item.vehicleYear} ${item.vehicleMake} ${item.vehicleModel}`}`}
                            rightIcon={<Ionicons name="car-sport" size={30} style={Styles.rightIcon} color={Colors.backDrop}/>}
                            style={{height: 'none', paddingBottom: 5}}
                        />
                        { item?.notes && (
                            <Tab
                                header='Appointment Note'
                                text={item?.notes}
                                style={{height: 'none', paddingBottom: 5}}
                            />
                        )}
                    </>
                </Animated.View>
            </>
        )
    };

    return (
        <>
            { appointments && appointments.length > 0 ? (
                <BackgroundAlt>
                    <FlatList
                        data={appointments}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <AppointmentItem item={item}/>}
                    />
                </BackgroundAlt>
            ) : (
                <Background>
                    <View style={[Styles.block, {alignItems: 'center'}]}>
                        <LottieView
                            source={require('../../../assets/animations/calendarError.json')}
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