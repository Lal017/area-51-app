import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Styles, ServiceStyles } from '../../../constants/styles';
import { useEffect, useState } from 'react';
import { formatDate, formatTime } from '../../../components/components';
import { handleDeleteAppointment, handleGetMyAppointments } from '../../../components/scheduleComponents';
import { useApp } from '../../../components/context';
import { handleSendAdminNotif } from '../../../components/notifComponents';
import { router } from 'expo-router';

const MyAppointments = () => {
    const { client, userId } = useApp();

    const [ appointments, setAppointments ] = useState();

    useEffect(() => {
        const getAppointments = async () =>
        {
            const getAppointments = await handleGetMyAppointments(client, userId);
            setAppointments(getAppointments);
        }

        getAppointments();
    }, []);
    
    return (
        <ScrollView contentContainerStyle={[Styles.scrollPage, {rowGap: 25, paddingTop: 25, paddingBottom: 25}]}>
            {appointments?.map((appointment, index) => (
                <View key={index} style={ServiceStyles.fieldContainer}>
                    <TouchableOpacity
                        style={ServiceStyles.editButton}
                        onPress={() => {router.push({
                            params: { appointmentParam: JSON.stringify(appointment) },
                            pathname: '/(tabs)/(service)/editAppointment'
                        })}}
                    >
                        <Text style={Styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.subTitle}>Date</Text>
                        <Text style={Styles.text}>{formatDate(appointment.date)}</Text>
                        <Text style={Styles.subTitle}>Time</Text>
                        <Text style={Styles.text}>{formatTime(appointment.time)}</Text>
                        <Text style={Styles.subTitle}>Vehicle</Text>
                        <Text style={Styles.text}>{`${appointment.vehicle.year} ${appointment.vehicle.make} ${appointment.vehicle.model}`}</Text>
                        <Text style={Styles.subTitle}>Service</Text>
                        <Text style={Styles.text}>{appointment.service}</Text>
                        <Text style={Styles.subTitle}>Description</Text>
                        <Text style={Styles.text}>{appointment.notes}</Text>
                    </View>
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
                                        onPress: () => {
                                            handleDeleteAppointment(client, appointment.id);
                                            handleSendAdminNotif('Appointment Cancelled', 'A customer has cancelled their appointment');
                                        }
                                    }
                                ]
                            )
                        }}
                    >
                        <Text style={Styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
};

export default MyAppointments;