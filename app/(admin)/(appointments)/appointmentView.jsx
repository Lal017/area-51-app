import { Styles } from '../../../constants/styles';
import { iconCheck } from '../../../components/appointmentComponents';
import { Background, Tab } from '../../../components/components';
import { useLocalSearchParams } from 'expo-router';
import { AntDesign, Entypo, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import { callUser, textUser, formatNumber, formatDate, formatTime } from '../../../constants/utils';

const AppointmentView = () =>
{
    const { appointmentParam } = useLocalSearchParams();
    const appointment = JSON.parse(appointmentParam);

    const vehicle = appointment?.vehicle ?? (appointment?.vehicleYear && {
        year: appointment.vehicleYear,
        make: appointment?.vehicleMake,
        model: appointment?.vehicleModel,
        color: appointment?.vehicleColor,
        plate: appointment?.vehiclePlate,
        vin: appointment?.vehicleVin
    });

    return (
        <Background>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.headerTitle}>{appointment?.user?.firstName} {appointment?.user?.lastName}</Text>
                    <Text style={Styles.tabHeader}>{appointment?.user?.email}</Text>
                    <Text style={Styles.tabHeader}>{formatNumber(appointment?.user?.phone)}</Text>
                </View>
                <View style={[Styles.rightIcon, {flexDirection: 'row', columnGap: 10}]}>
                    <TouchableOpacity
                        style={{padding: 5, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => callUser(appointment?.user?.phone)}
                    >
                        <Entypo name='phone' size={30} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{padding: 5, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => textUser(appointment?.user?.phone)}
                    >
                        <Entypo name='message' size={30} color='white'/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Tab
                        header='Date'
                        text={`${formatDate(appointment?.date)}`}
                        leftIcon={<AntDesign name='calendar' size={30} style={Styles.icon}/>}
                    />
                    <Tab
                        header='Time'
                        text={`${formatTime(appointment?.time)}`}
                        leftIcon={<MaterialCommunityIcons name='clock' size={30} style={Styles.icon}/>}
                    />
                    <Tab
                        header='Service'
                        text={`${appointment?.service}`}
                        leftIcon={iconCheck(appointment?.service)}
                    />
                </View>
                { appointment?.notes && (
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.headerTitle}>Customer Note</Text>
                        <Text style={Styles.text}>{appointment.notes}</Text>
                    </View>
                )}
            </View>
            <View style={[Styles.floatingBlock, {marginBottom: 10}]}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.headerTitle}>Vehicle</Text>
                </View>
                <Tab
                    header={`${vehicle?.year}`}
                    text={`${vehicle?.make} ${vehicle?.model}`}
                    leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon}/>}
                    style={{height: 'none'}}
                />
                <Tab
                    header='Vehicle Color'
                    text={`${vehicle?.color}`}
                    leftIcon={<FontAwesome name='paint-brush' size={30} style={Styles.icon}/>}
                    style={{height: 'none'}}
                />
                { vehicle?.plate && (
                    <Tab
                        header='License Plate #'
                        text={`${vehicle?.plate}`}
                        leftIcon={<FontAwesome name='id-card' size={30} style={Styles.icon}/>}
                        style={{height: 'none'}}
                    />
                )}
                { vehicle?.vin && (
                    <Tab
                        header='VIN'
                        text={`${vehicle?.vin}`}
                        leftIcon={<FontAwesome name='barcode' size={30} style={Styles.icon}/>}
                        style={{height: 'none'}}
                    />
                )}
            </View>
        </Background>
    );
};

export default AppointmentView;