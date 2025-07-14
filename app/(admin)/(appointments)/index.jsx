import { TouchableOpacity, Text } from 'react-native';
import { Background } from '../../../components/components';
import { router } from 'expo-router';
import { Styles } from '../../../constants/styles';

const AppointmentIndex = () =>
{
    return (
        <Background>
            <TouchableOpacity
                onPress={() => router.push('appointmentList')}
                style={Styles.actionButton}
            >
                <Text style={Styles.actionText}>Appointment List</Text>
            </TouchableOpacity>
        </Background>
    );
};

export default AppointmentIndex;