import { View, TouchableOpacity, Text } from 'react-native';
import { AdminStyles, Styles } from '../../constants/styles';
import { useApp } from '../../components/context';
import { useEffect, useState } from 'react';
import { listAppointments } from '../../src/graphql/queries';
import { Background, formatDate, formatTime } from '../../components/components';
import { router } from 'expo-router';

const AppointmentList = () =>
{
    const { client } = useApp();
    const [ appointments, setAppointments ] = useState();

    useEffect(() => {
        const handleGetAppointments = async () =>
        {
            try {
                const getAppointments = await client.graphql({
                    query: listAppointments,
                });

                setAppointments(getAppointments.data.listAppointments.items);
            } catch (error) {
                console.log('Error getting appointments:', error);
            }
        }

        handleGetAppointments();
    }, []);

    return (
        <Background>
            <View style={[Styles.block, {rowGap: 0}]}>
                {appointments ? (
                    appointments.map((appointment, index) => (
                        <TouchableOpacity
                            key={index}
                            style={AdminStyles.customerBox}
                            onPress={() => router.push({
                                params: { appointmentParam: JSON.stringify(appointment)},
                                pathname: '/(admin)/appointmentView'
                            })}
                        >
                            <Text style={Styles.subTitle}>{appointment.user.name}</Text>
                            <Text style={Styles.text}>{formatDate(appointment.date)}</Text>
                            <Text style={Styles.text}>{formatTime(appointment.time)}</Text>
                        </TouchableOpacity>
                    ))
                ) : null}
            </View>
        </Background>
    );
};

export default AppointmentList;