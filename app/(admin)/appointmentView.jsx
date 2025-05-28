import { View, Text } from 'react-native';
import { AdminStyles, Styles } from '../../constants/styles';
import { useLocalSearchParams } from 'expo-router';
import { formatNumber, formatDate, formatTime } from '../../components/components';

const AppointmentView = () =>
{
    const { appointmentParam } = useLocalSearchParams();
    const appointment = JSON.parse(appointmentParam);

    return (
        <View style={[Styles.page, {justifyContent: 'flex-start'}]}>
            <View style={Styles.infoContainer}>
                <View style={Styles.block}>
                    <Text style={[Styles.title, {textAlign: 'left'}]}>Customer</Text>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Name</Text>
                        <Text style={Styles.text}>{appointment.user.name}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Email</Text>
                        <Text style={Styles.text}>{appointment.user.email}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Phone Number</Text>
                        <Text style={Styles.text}>{formatNumber(appointment.user.phone)}</Text>
                    </View>
                </View>
                <View style={Styles.block}>
                    <Text style={[Styles.title, {textAlign: 'left'}]}>Details</Text>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Day</Text>
                        <Text style={Styles.text}>{formatDate(appointment.date)}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Time</Text>
                        <Text style={Styles.text}>{formatTime(appointment.time)}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Service</Text>
                        <Text style={Styles.text}>{appointment.service}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Scheduled on</Text>
                        <Text style={Styles.text}>{formatDate(appointment.createdAt)}</Text>
                    </View>
                </View>
                <Text style={[Styles.title, {textAlign: 'left'}]}>Vehicle</Text>
                <View style={AdminStyles.vehicleContainer}>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Year</Text>
                        <Text style={Styles.text}>{appointment.vehicle.year}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Make</Text>
                        <Text style={Styles.text}>{appointment.vehicle.make}</Text>
                    </View>
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Model</Text>
                        <Text style={Styles.text}>{appointment.vehicle.model}</Text>
                    </View>
                    { appointment.vehicle.color ? (
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Color</Text>
                        <Text style={Styles.text}>{appointment.vehicle.color}</Text>
                    </View>
                    ) : null }
                    { appointment.vehicle.plate ? (
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>Plate</Text>
                        <Text style={Styles.text}>{appointment.vehicle.plate}</Text>
                    </View>
                    ) : null }
                    { appointment.vehicle.vin ? (
                    <View style={AdminStyles.labelContainer}>
                        <Text style={Styles.subTitle}>VIN</Text>
                        <Text style={Styles.text}>{appointment.vehicle.vin}</Text>
                    </View>
                    ) : null }
                </View>
            </View>
        </View>
    );
};

export default AppointmentView;