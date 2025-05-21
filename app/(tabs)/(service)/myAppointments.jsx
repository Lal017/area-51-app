import { View } from 'react-native';
import { Styles } from '../../../constants/styles';
import { useEffect, useState } from 'react';
import { handleGetMyAppointments } from '../../../components/scheduleComponents';
import { useApp } from '../../../components/context';

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
        <View style={Styles.page}>
        </View>
    );
};

export default MyAppointments;