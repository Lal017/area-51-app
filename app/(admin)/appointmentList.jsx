import { View, Text } from 'react-native';
import { Styles } from '../../constants/styles';
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
    const [ refreshing, setRefreshing ] = useState();

    const onRefresh = async () =>
    {
        setRefreshing(true);

        try {
            const getAppointments = await client.graphql({
                query: listAppointments,
            });

            setAppointments(getAppointments.data.listAppointments.items);
        } catch (error) {
            console.log('Error refreshing:', error);
        }

        setRefreshing(false);
    };

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
        <Background refreshing={refreshing} onRefresh={onRefresh}>
            { appointments?.length > 0 ? (
                <View style={[Styles.block, {rowGap: 15}]}>
                    {appointments ? (
                        appointments.map((appointment, index) => (
                            <Tab
                                key={index}
                                action={() => {
                                    console.log(appointment)
                                    router.push({
                                        params: { appointmentParam: JSON.stringify(appointment)},
                                        pathname: '/(admin)/appointmentView'
                                    })}
                                }
                                text={`${appointment.user.firstName} ${appointment.user.lastName}\n${formatDate(appointment.date)} ${formatTime(appointment.time)}`}
                                leftIcon={<AntDesign name='calendar' size={30} style={Styles.icon} />}
                                rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                            />
                        ))
                    ) : null}
                </View>
            ) : (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={Styles.subTitle}>No Appointments</Text>
                </View>
            )}
        </Background>
    );
};

export default AppointmentList;