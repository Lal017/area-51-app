import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Styles, AdminStyles } from '../../../constants/styles';
import { router, useLocalSearchParams } from 'expo-router';
import { Background, formatDate, formatNumber, Tab } from '../../../components/components';
import { sendPushNotification } from '../../../components/adminComponents';
import { AntDesign, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import Colors from '../../../constants/colors';
import { useNavigation } from '@react-navigation/native';

const UserView = () =>
{
    const { userParam } = useLocalSearchParams();
    const customer = JSON.parse(userParam);
    const navigate = useNavigation();

    const [ title, setTitle ] = useState();
    const [ body, setBody ] = useState();
    const [ loading, setLoading ] = useState(false);

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
            <Background>
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={[Styles.title, {textAlign: 'left'}]}>Customer</Text>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Name</Text>
                            <Text style={Styles.text}>{customer.firstName} {customer.lastName}</Text>
                        </View>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Email</Text>
                            <Text style={Styles.text}>{customer.email}</Text>
                        </View>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Phone Number</Text>
                            <Text style={Styles.text}>{formatNumber(customer.phone)}</Text>
                        </View>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.subTitle}>Created on</Text>
                            <Text style={Styles.text}>{formatDate(customer.createdAt)}</Text>
                        </View>
                    </View>
                </View>
                <View style={Styles.block}>
                    { customer?.vehicles?.items?.length > 0 ? (<Text style={[Styles.title, {paddingLeft: 20}]}>Vehicles</Text>)
                        : (<Text style={[Styles.title, {paddingLeft: 20}]}>Customer has no vehicles</Text>)}
                    { customer?.vehicles?.items?.map((vehicle, index) => (
                        <View style={AdminStyles.vehicleContainer} key={index}>
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.text}>Vehicle {index + 1}</Text>
                            </View>
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Year</Text>
                                <Text style={Styles.text}>{vehicle.year}</Text>
                            </View>
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Make</Text>
                                <Text style={Styles.text}>{vehicle.make}</Text>
                            </View>
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Model</Text>
                                <Text style={Styles.text}>{vehicle.model}</Text>
                            </View>
                            { vehicle.color ? (
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Color</Text>
                                <Text style={Styles.text}>{vehicle.color}</Text>
                            </View>
                            ) : null }
                            { vehicle.plate ? (
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>Plate</Text>
                                <Text style={Styles.text}>{vehicle.plate}</Text>
                            </View>
                            ) : null }
                            { vehicle.vin ? (
                            <View style={AdminStyles.labelContainer}>
                                <Text style={Styles.subTitle}>VIN</Text>
                                <Text style={Styles.text}>{vehicle.vin}</Text>
                            </View>
                            ) : null }
                        </View>
                    ))}
                </View>
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.title}>Invoice Upload</Text>
                        <Text style={Styles.text}>Upload an invoice to this customers account</Text>
                    </View>
                    <Tab
                        text='Upload Invoice'
                        action={() => router.push({
                            pathname: '/(admin)/invoiceUpload',
                            params: { userParam }
                        })}
                        leftIcon={<FontAwesome6 name='file-pdf' size={30} style={Styles.icon} />}
                        rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                    />
                    <Tab
                        text='View Invoices'
                        action={() => router.push({
                            pathname: '/(admin)/invoiceList',
                            params: { userParam }
                        })}
                        leftIcon={<FontAwesome6 name='file-invoice-dollar' size={30} style={Styles.icon} />}
                        rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                    />
                </View>
                <View style={Styles.block}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.title}>Estimate Upload</Text>
                        <Text style={Styles.text}>Upload an estimate to this customers account</Text>
                    </View>
                    <Tab
                        text='Upload Estimate'
                        action={() => router.push({
                            pathname: '/(admin)/estimateUpload',
                            params: { userParam }
                        })}
                        leftIcon={<FontAwesome6 name='file-pdf' size={30} style={Styles.icon} />}
                        rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                    />
                    <Tab
                        text='View Estimates'
                        action={() => router.push({
                            pathname: '/(admin)/estimateList',
                            params: { userParam }
                        })}
                        leftIcon={<FontAwesome6 name='file-circle-question' size={30} style={Styles.icon} />}
                        rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                    />
                </View>
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.title}>Send Notification</Text>
                        <Text style={Styles.text}>Send a push notification to {customer.firstName}</Text>
                    </View>
                    <View style={Styles.inputContainer}>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name='notifications' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='Title'
                                placeholderTextColor={Colors.text}
                                value={title}
                                onChangeText={setTitle}
                                style={Styles.input}
                            />
                        </View>
                        <View style={Styles.inputWrapper}>
                            <MaterialIcons name='subject' size={20} style={Styles.icon} />
                            <TextInput
                                placeholder='Body'
                                placeholderTextColor={Colors.text}
                                value={body}
                                onChangeText={setBody}
                                style={Styles.input}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={async () => {
                            if (loading) return;
                            setLoading(true);
                            Alert.alert(
                                'Confirmation',
                                `Send this notification?\n\n${title}\n${body}`,
                                [
                                    { text: 'No'},
                                    {
                                        text: 'Yes',
                                        onPress: async () => {
                                            await sendPushNotification(customer.pushToken, title, body);
                                            Alert.alert(
                                                'Notification Sent',
                                                'Your notification has been sent!',
                                                [{ text: 'OK' }]
                                            );
                                            setBody('');
                                            setTitle('');
                                        }
                                    }
                                ]
                            )
                            setLoading(false);
                        }}
                        style={[Styles.actionButton, loading && {opacity: 0.5}]}
                        disabled={loading}
                    >
                        <Text style={Styles.actionText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default UserView;