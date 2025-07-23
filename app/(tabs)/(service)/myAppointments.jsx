import { Background, formatDate, formatTime } from '../../../components/components';
import { handleDeleteAppointment, handleGetMyAppointments } from '../../../components/appointmentComponents';
import { useApp } from '../../../components/context';
import { handleSendAdminNotif } from '../../../components/notifComponents';
import { Styles, ServiceStyles } from '../../../constants/styles';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

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
    
    return (
        <>
            { appointments && appointments.length > 0 ? (
                <Background>
                    {appointments?.map((appointment, index) => (
                        <View key={index} style={ServiceStyles.fieldContainer}>
                            <View style={Styles.infoContainer}>
                                <Text style={Styles.subTitle}>Date</Text>
                                <Text style={Styles.text}>{formatDate(appointment?.date)}</Text>
                                <Text style={Styles.subTitle}>Time</Text>
                                <Text style={Styles.text}>{formatTime(appointment?.time)}</Text>
                                <Text style={Styles.subTitle}>Vehicle</Text>
                                <Text style={Styles.text}>{`${appointment?.vehicle?.year} ${appointment?.vehicle?.make} ${appointment?.vehicle?.model}`}</Text>
                                <Text style={Styles.subTitle}>Service</Text>
                                <Text style={Styles.text}>{appointment?.service}</Text>
                                <Text style={Styles.subTitle}>Description</Text>
                                <Text style={Styles.text}>{appointment?.notes}</Text>
                            </View>
                            <TouchableOpacity
                                style={Styles.actionButton}
                                onPress={() => {
                                    router.push({
                                        params: { appointmentParam: JSON.stringify(appointment) },
                                        pathname: '/(tabs)/(service)/editAppointment'
                                    });
                                }}
                            >
                                <Text style={Styles.actionText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[Styles.actionButton, {alignSelf: 'center', backgroundColor: 'red'}]}
                                onPress={() => {
                                    Alert.alert(
                                        'Confirm',
                                        'Are you sure you would like to cancel your appointment?',
                                        [
                                            { text: 'No' },
                                            {
                                                text: 'Yes',
                                                onPress: async () => {
                                                    try {
                                                        await handleDeleteAppointment(client, appointment?.id, userId, setAppointments);
                                                        await handleSendAdminNotif('Appointment Cancelled', 'A customer has cancelled their appointment');
                                                        navigate.reset({
                                                            index: 0,
                                                            routes: [{ name: '(service)' }]
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
                                <Text style={Styles.actionText}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={[Styles.block, {alignItems: 'center'}]}>
                                {index < appointments.length - 1 && <View style={Styles.hr} />}
                            </View>
                        </View>
                    ))}
                </Background>
            ) : (
                <Background style={{justifyContent: 'center'}}>
                    <Text style={Styles.subTitle}>No Appointments</Text>
                </Background>
            )}
        </>
    );
};

export default MyAppointments;