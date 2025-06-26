import { View, TouchableOpacity, Text } from 'react-native';
import { AdminStyles, Styles } from '../../constants/styles';
import { useApp } from '../../components/context';
import { useEffect, useState } from 'react';
import { listAppointments } from '../../src/graphql/queries';
import { Background, formatDate, formatTime, Tab } from '../../components/components';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

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
            <View style={[Styles.block, {rowGap: 15}]}>
                {appointments ? (
                    appointments.map((appointment, index) => (
                        <Tab
                            key={index}
                            action={() => router.push({
                                params: { appointmentParam: JSON.stringify(appointment)},
                                pathname: '/(admin)/appointmentView'
                            })}
                            text={`${appointment.user.firstName}\n${formatDate(appointment.date)}\n${formatTime(appointment.time)}`}
                            leftIcon={<AntDesign name='calendar' size={30} style={Styles.icon} />}
                            rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                        />
                    ))
                ) : null}
            </View>
        </Background>
    );
};

export default AppointmentList;