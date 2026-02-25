import Colors from '../../../constants/colors';
import { Styles } from '../../../constants/styles';
import { Background, formatDate, formatNumber, Tab, SimpleList } from '../../../components/components';
import { sendPushNotification } from '../../../components/notifComponents';
import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AntDesign, Entypo, FontAwesome, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { handleAssignTowDriverId, handleMakeUserTowDriver } from '../../../components/adminComponents';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../../components/context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const UserView = () =>
{
    const { client } = useApp();
    const { userParam } = useLocalSearchParams();
    const customer = JSON.parse(userParam);
    const navigate = useNavigation();

    const [ title, setTitle ] = useState();
    const [ body, setBody ] = useState();
    const [ loading, setLoading ] = useState(false);

    const VehicleItem = ({item}) =>
    {
        const expandedHeight = useSharedValue(0);
        const toggleExpand = () => expandedHeight.value = expandedHeight.value === 0 ? 500 : 0;

        const dropStyle = useAnimatedStyle(() => ({
            maxHeight: withSpring(expandedHeight.value),
            overflow: 'hidden'
        }));

        return (
            <>
                <Tab
                    header={`${item.year}`}
                    text={`${item.make} ${item.model}`}
                    action={toggleExpand}
                    leftIcon={<Ionicons name='car-sport' style={Styles.icon} size={30}/>}
                />
                <Animated.View style={dropStyle}>
                    <Tab
                        header='Vehicle Color'
                        text={`${item.color}`}
                        rightIcon={<FontAwesome name='paint-brush' size={25} style={Styles.rightIcon}/>}
                        style={{height: 'none'}}
                    />
                    { item.plate && (
                        <Tab
                            header='License Plate #'
                            text={`${item.plate}`}
                            rightIcon={<FontAwesome name='id-card' size={25} style={Styles.rightIcon}/>}
                            style={{height: 'none', padding: 5}}
                        />
                    )}
                    { item.vin && (
                        <Tab
                            header='VIN'
                            text={`${item.vin}`}
                            rightIcon={<FontAwesome name='barcode' size={25} style={Styles.rightIcon}/> }
                            style={{height: 'none', padding: 5}}
                        />
                    )}
                </Animated.View>
            </>
        );
    };

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
            <Background>
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <View style={Styles.block}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>{customer?.firstName} {customer?.lastName}</Text>
                            <Text style={Styles.tabHeader}>{customer?.email}</Text>
                            <Text style={Styles.tabHeader}>{formatNumber(customer?.phone)}</Text>
                        </View>
                        <Tab
                            header='Created On'
                            text={`${formatDate(customer.createdAt)}`}
                            leftIcon={<Entypo name='calendar' style={Styles.icon} size={30}/>}
                            style={{height: 'none'}}
                        />
                        <Tab
                            header='Group'
                            text={`${customer?.access}`}
                            leftIcon={<FontAwesome name='group' size={30} style={Styles.icon}/>}
                            style={{height: 'none'}}
                        />
                    </View>
                    { customer?.driverId === '1' ? (
                        <View style={[Styles.floatingBlock, {backgroundColor: Colors.tertiary}]}>
                            <View style={Styles.infoContainer}>
                                <Text style={Styles.headerTitle}>NOTICE</Text>
                                <Text style={Styles.tabHeader}>This user is requesting to become a tow truck driver. Would you like to convert their account into a TowDriver account?</Text>
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
                        </View>
                    ) : null}
                    { customer?.access === 'Customers' &&  (
                        <View style={Styles.floatingBlock}>
                            <View style={Styles.infoContainer}>
                                <Text style={Styles.headerTitle}>Vehicles</Text>
                                { customer?.vehicles?.items?.length > 0 && customer?.access === 'Customers' ? (
                                    <SimpleList
                                        data={customer?.vehicles?.items}
                                        renderItem={({item}) => <VehicleItem item={item}/>}
                                    />
                                ) : (<Text style={Styles.tabHeader}>No Vehicles</Text>)}
                            </View>
                        </View>
                    )}
                    { customer?.access === 'Customers' && (
                        <View style={Styles.block}>
                            <View style={Styles.infoContainer}>
                                <Text style={Styles.headerTitle}>Invoices & Estimates</Text>
                                <Text style={Styles.tabHeader}>Upload or view files for this customer</Text>
                            </View>
                            <Tab
                                text='Upload Invoice'
                                action={() => router.push({
                                    pathname: '/(admin)/invoiceUpload',
                                    params: { isInvoice: true, userParam }
                                })}
                                leftIcon={<AntDesign name='upload' size={30} style={Styles.icon} />}
                                rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                            />
                            <Tab
                                text='Upload Estimate'
                                action={() => router.push({
                                    pathname: '/(admin)/estimateUpload',
                                    params: { userParam }
                                })}
                                leftIcon={<AntDesign name='upload' size={30} style={Styles.icon} />}
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
                    )}
                    <View style={Styles.floatingBlock}>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>Send Notification</Text>
                            <Text style={Styles.tabHeader}>Send a push notification to {customer.firstName}</Text>
                        </View>
                        <View style={Styles.inputContainer}>
                            <View style={Styles.inputWrapper}>
                                <Ionicons name='notifications' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='Title'
                                    placeholderTextColor={Colors.subText}
                                    value={title}
                                    onChangeText={setTitle}
                                    style={Styles.input}
                                />
                            </View>
                            <View style={Styles.inputWrapper}>
                                <MaterialIcons name='subject' size={20} style={Styles.icon} />
                                <TextInput
                                    placeholder='Body'
                                    placeholderTextColor={Colors.subText}
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
                                setLoading(false);
                            }}
                            style={[Styles.actionButton, {alignSelf: 'center'}, loading && {opacity: 0.5}]}
                            disabled={loading}
                        >
                            <Text style={Styles.actionText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default UserView;