import { Styles } from '../../../constants/styles';
import { iconCheck } from '../../../components/appointmentComponents';
import { formatNumber, formatDate, formatTime, Background, Tab, callCustomer, textCustomer } from '../../../components/components';
import { useLocalSearchParams } from 'expo-router';
import { AntDesign, Entypo, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

const AppointmentView = () =>
{
    const { appointmentParam } = useLocalSearchParams();
    const appointment = JSON.parse(appointmentParam);

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
                        onPress={() => callCustomer(appointment?.user?.phone)}
                    >
                        <Entypo name='phone' size={30} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{padding: 5, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => textCustomer(appointment?.user?.phone)}
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
                    header={`${appointment?.vehicle?.year}`}
                    text={`${appointment?.vehicle?.make} ${appointment?.vehicle?.model}`}
                    leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon}/>}
                    style={{height: 'none'}}
                />
                <Tab
                    header='Vehicle Color'
                    text={`${appointment?.vehicle?.color}`}
                    leftIcon={<FontAwesome name='paint-brush' size={30} style={Styles.icon}/>}
                    style={{height: 'none'}}
                />
                { appointment?.vehicle?.plate && (
                    <Tab
                        header='License Plate #'
                        text={`${appointment?.vehicle?.plate}`}
                        leftIcon={<FontAwesome name='id-card' size={30} style={Styles.icon}/>}
                        style={{height: 'none'}}
                    />
                )}
                { appointment?.vehicle?.vin && (
                    <Tab
                        header='VIN'
                        text={`${appointment?.vehicle?.vin}`}
                        leftIcon={<FontAwesome name='barcode' size={30} style={Styles.icon}/>}
                        style={{height: 'none'}}
                    />
                )}
            </View>
        </Background>
    );
};

export default AppointmentView;