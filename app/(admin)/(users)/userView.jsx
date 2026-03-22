import Colors from '../../../constants/colors';
import { Styles } from '../../../constants/styles';
import { Background, Tab, SimpleList, FloatingBlock, ActionButton, DropDownTab, SubTab } from '../../../components/components';
import { sendPushNotification } from '../../../components/notifComponents';
import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AntDesign, Entypo, FontAwesome, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { handleAssignTowDriverId, handleMakeUserTowDriver } from '../../../components/adminComponents';
import { useApp } from '../../../components/context';
import { callUser, textUser, formatDate, formatNumber } from '../../../constants/utils';

const UserView = () =>
{
    const { client } = useApp();
    const { userParam } = useLocalSearchParams();
    const customer = JSON.parse(userParam);

    const [ title, setTitle ] = useState();
    const [ body, setBody ] = useState();
    const [ loading, setLoading ] = useState(false);

    return (
        <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
            <Background hasTab={false}>
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
                    <View style={[Styles.rightIcon, {flexDirection: 'row', columnGap: 10}]}>
                        <TouchableOpacity
                            style={{justifyContent: 'center', alignItems: 'center', padding: 5}}
                            onPress={() => callUser(customer?.phone)}
                        >
                            <Entypo name='phone' size={30} color='white'/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{justifyContent: 'center', alignItems: 'center', padding: 5}}
                            onPress={() => textUser(customer?.phone)}    
                        >
                            <Entypo name='message' size={30} color='white'/>
                        </TouchableOpacity>
                    </View>
                </View>
                { customer?.driverId === '1' && (
                    <FloatingBlock>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>NOTICE</Text>
                            <Text style={Styles.tabHeader}>This user is requesting to become a tow truck driver. Would you like to convert their account into a TowDriver account?</Text>
                        </View>
                        <ActionButton
                            text='Convert'
                            onPress={async () => {
                                Alert.alert(
                                    'Confirmation',
                                    `Are you sure you want to make ${customer?.firstName} ${customer?.lastName} a tow truck driver?`,
                                    [
                                        { text: 'No'},
                                        {
                                            text: 'Yes',
                                            onPress: async () => {
                                                if (loading) return;
                                                setLoading(true);
                                                try {
                                                    await handleMakeUserTowDriver(customer?.email);
                                                    await handleAssignTowDriverId(client, customer?.id);
                                                    await sendPushNotification(customer.pushToken, 'Driver Account Request', 'Your account is ready!', { type: "DRIVER_ACCOUNT" });
                                                    if (router.canDismiss()) router.dismissAll();
                                                    router.replace('/');
                                                } catch (error) {
                                                    console.error('ERROR, could not convert user to a tow truck driver:', error);
                                                }
                                                setLoading(false);
                                            }
                                        }
                                    ]
                                );
                            }}
                        />
                    </FloatingBlock>
                )}
                { customer?.access === 'Customers' &&  (
                    <FloatingBlock>
                        <View style={Styles.infoContainer}>
                            <Text style={Styles.headerTitle}>Vehicles</Text>
                            { customer?.vehicles?.items?.length > 0 && customer?.access === 'Customers' ? (
                                <SimpleList
                                    data={customer?.vehicles?.items}
                                    renderItem={({item}) => {
                                        console.log(item);
                                        return(
                                            <DropDownTab
                                                parentTab={(toggleExpand) =>
                                                    <Tab
                                                        header={`${item.year}`}
                                                        text={`${item.make} ${item.model}`}
                                                        action={toggleExpand}
                                                        leftIcon={<Ionicons name='car-sport' style={Styles.icon} size={30}/>}
                                                    />
                                                }
                                                childTabs={[
                                                    <SubTab
                                                        header='Vehicle Color'
                                                        text={`${item.color}`}
                                                        icon={<FontAwesome name='paint-brush' size={25} style={Styles.icon}/>}
                                                    />,
                                                    item?.plate && (
                                                        <SubTab
                                                            header='License Plate #'
                                                            text={`${item.plate}`}
                                                            icon={<FontAwesome name='id-card' size={25} style={Styles.icon}/>}
                                                        />
                                                    ),
                                                    item?.vin && (
                                                        <SubTab
                                                            header='VIN'
                                                            text={`${item.vin}`}
                                                            icon={<FontAwesome name='barcode' size={25} style={Styles.icon}/> }
                                                        />
                                                    )
                                                ].filter(Boolean)}
                                            />
                                        )
                                    }}
                                />
                            ) : (<Text style={Styles.tabHeader}>No Vehicles</Text>)}
                        </View>
                    </FloatingBlock>
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
                <FloatingBlock>
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.headerTitle}>Send Notification</Text>
                        <Text style={Styles.tabHeader}>Send a push notification to {customer.firstName}</Text>
                    </View>
                    <View style={Styles.inputWrapper}>
                        <Ionicons name='notifications' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Title'
                            placeholderTextColor={Colors.grayText}
                            value={title}
                            onChangeText={setTitle}
                            style={Styles.input}
                        />
                    </View>
                    <View style={Styles.inputWrapper}>
                        <MaterialIcons name='subject' size={20} style={Styles.icon} />
                        <TextInput
                            placeholder='Body'
                            placeholderTextColor={Colors.grayText}
                            value={body}
                            onChangeText={setBody}
                            style={Styles.input}
                        />
                    </View>
                    <ActionButton
                        text='Send'
                        onPress={async () => {
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
                        }}
                    />
                </FloatingBlock>
            </Background>
        </KeyboardAvoidingView>
    );
};

export default UserView;