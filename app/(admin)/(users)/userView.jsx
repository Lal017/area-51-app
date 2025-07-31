import Colors from '../../../constants/colors';
import { Styles, AdminStyles } from '../../../constants/styles';
import { Background, formatDate, formatNumber, Tab } from '../../../components/components';
import { sendPushNotification } from '../../../components/notifComponents';
import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AntDesign, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { handleAssignTowDriverId, handleMakeUserTowDriver } from '../../../components/adminComponents';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../../components/context';

const UserView = () =>
{
    const { client } = useApp();
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
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Customer</Text>
                        <Text style={Styles.text}>{customer?.firstName} {customer?.lastName} | {formatNumber(customer?.phone)} | {customer?.email}</Text>
                    </View>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Account details</Text>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.text}>Created on:</Text>
                            <Text style={Styles.text}>{formatDate(customer.createdAt)}</Text>
                        </View>
                        <View style={AdminStyles.labelContainer}>
                            <Text style={Styles.text}>Group:</Text>
                            <Text style={Styles.text}>{customer?.access}</Text>
                        </View>
                    </View>
                    { customer?.driverId === '1' ? (
                        <>
                            <View style={[Styles.infoContainer, {rowGap: 0}]}>
                                <Text style={Styles.subTitle}>NOTICE</Text>
                                <Text style={Styles.text}>The user is requesting to become a tow truck driver. Would you like to make them into a driver?</Text>
                            </View>
                            <TouchableOpacity
                                style={[Styles.actionButton, {backgroundColor: Colors.secondary, alignSelf: 'center'}]}
                                onPress={() => {
                                    Alert.alert(
                                        'Confirmation',
                                        `Are you sure you want to make ${customer?.firstName} ${customer?.lastName} a tow truck driver?`,
                                        [
                                            { text: 'No'},
                                            {
                                                text: 'Yes',
                                                onPress: async () => {
                                                    try {
                                                        await handleMakeUserTowDriver(customer?.email);
                                                        await handleAssignTowDriverId(client, customer?.id);
                                                        Alert.alert(
                                                            'Driver Created',
                                                            'The user has been converted into a tow truck driver',
                                                            [{ text: 'OK' }]
                                                        );
                                                        const data = {
                                                            type: "DRIVER_ACCOUNT"
                                                        };
                                                        await sendPushNotification(customer.pushToken, 'Driver Account Request', 'Your account is ready!', data);
                                                        navigate.reset({
                                                            index: 0,
                                                            routes: [{ name: '(admin)'}]
                                                        });
                                                    } catch (error) {
                                                        console.error('ERROR, could not convert user to a tow truck driver:', error);
                                                    }
                                                }
                                            }
                                        ]
                                    );
                                }}
                            >
                                <Text style={Styles.actionText}>Convert</Text>
                            </TouchableOpacity>
                        </>
                    ) : null}
                </View>
                <View style={Styles.infoContainer}>
                    { customer?.vehicles?.items?.length > 0 ? (<Text style={Styles.subTitle}>Vehicles</Text>)
                        : customer?.access === 'Customers' && customer?.vehicle?.items?.lenth === 0 ? (<Text style={[Styles.subTitle, {alignSelf: 'center'}]}>Customer has no vehicles</Text>) : null}
                    { customer?.vehicles?.items?.map((vehicle, index) => (
                        <View key={index}>
                            <Text style={Styles.text}>{vehicle?.year} {vehicle?.make} {vehicle?.model} ({vehicle?.color})</Text>
                            { vehicle?.plate ? (
                                <View style={AdminStyles.labelContainer}>
                                    <Text style={Styles.text}>Plate:</Text>
                                    <Text style={Styles.text}>{vehicle?.plate}</Text>
                                </View>
                            ) : null}
                            { vehicle?.vin ? (
                                <View style={AdminStyles.labelContainer}>
                                    <Text style={Styles.text}>VIN:</Text>
                                    <Text style={Styles.text}>{vehicle?.vin}</Text>
                                </View>
                            ) : null}
                        </View>
                    ))}
                </View>
                <View style={Styles.block}>
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Invoice Upload</Text>
                        <Text style={Styles.text}>Upload an invoice to this customers account</Text>
                    </View>
                    <Tab
                        text='Upload Invoice'
                        action={() => router.push({
                            pathname: '/(admin)/invoiceUpload',
                            params: { isInvoice: true, userParam }
                        })}
                        leftIcon={<FontAwesome6 name='file-pdf' size={30} style={Styles.icon} />}
                        rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                    />
                    <Tab
                        text='View Invoices'
                        action={() => router.push({
                            pathname: '/(admin)/invoiceList',
                            params: { isInvoice: true, userParam }
                        })}
                        leftIcon={<FontAwesome6 name='file-invoice-dollar' size={30} style={Styles.icon} />}
                        rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                    />
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Estimate Upload</Text>
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
                    <View style={[Styles.infoContainer, {rowGap: 0}]}>
                        <Text style={Styles.subTitle}>Send Notification</Text>
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
                                            const data = {
                                                type: "CUSTOM_NOTIFICATION"
                                            };
                                            await sendPushNotification(customer.pushToken, title, body, data);
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
                        style={[Styles.actionButton, {alignSelf: 'center'}, loading && {opacity: 0.5}]}
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