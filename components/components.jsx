import { View, Text, TouchableOpacity, ScrollView, Alert, Animated, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useApp } from './context';
import { Styles, ServiceStyles, HomeStyles } from '../constants/styles';
import Colors from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { handleUpdateTowRequestStatus } from './scheduleComponents';
import { handleSendAdminNotif } from './notifComponents';
import { useEffect, useRef, useState } from 'react';
import { list, remove } from 'aws-amplify/storage';

// loading page
const Loading = () => {
    return (
        <Background style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.secondary} />
        </Background>
    );
};

// custom header component to replace default header
const CustHeader = ({title, index}) =>
{
    const { isStuck } = useApp();

    return (
        <View style={Styles.HeaderContainer}>
            { !index && !isStuck && router.canGoBack() ? (
                <TouchableOpacity
                    style={{position: 'absolute', left: 20, top: 45}}
                    onPress={() => router.back()}
                >
                    <AntDesign name='left' size={30} color='white' />
                </TouchableOpacity>
            ) : null }
            <Text style={[Styles.headerTitle, {textAlign: 'center'}]}>{title}</Text>
        </View>
    );
};

// wraps the page
const AuthBackground = ({children}) =>
{
    return (
        <LinearGradient
            style={{flex: 1}}
            colors={[Colors.backgroundFade, Colors.background]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
        >
            <ScrollView
                contentContainerStyle={Styles.page}
                keyboardShouldPersistTaps='handled'
            >
                {children}
            </ScrollView>
        </LinearGradient>
    );
};

const Background = ({children, style}) =>
{
    return (
        <LinearGradient
            style={{flex: 1}}
            colors={[Colors.background, Colors.backgroundFade, Colors.background]}
            locations={[0.1, 0.5, 0.9]}
            start={{x: 1, y: 0.9}}
            end={{x: 0, y: 0.4}}
            dither={false}
        >
            <ScrollView
                contentContainerStyle={[Styles.page, style]}
                keyboardShouldPersistTaps='handled'
            >
                {children}
            </ScrollView>
        </LinearGradient>
    )
};

const BackgroundAlt = ({children, style}) =>
{
    return (
        <LinearGradient
            style={[{flex: 1}, style]}
            colors={[Colors.background, Colors.backgroundFade, Colors.background]}
            locations={[0.1, 0.5, 0.9]}
            start={{x: 1, y: 0.9}}
            end={{x: 0, y: 0.4}}
            dither={false}
        >
            {children}
        </LinearGradient>
    );
};

// custom calendar header
const CalendarHeader = ({date}) =>
{
    const d = new Date(date);
    const month = d.toLocaleString('default', { month: 'long' });
    return (
        <View style={Styles.calendarHeaderContainer}>
            <Text style={Styles.text}>{month}</Text>
        </View>
    );
};

// reusable tab component for tabs
const Tab = ({text, action, leftIcon, rightIcon}) =>
{
    return(
        <TouchableOpacity
            style={Styles.tabWrapper}
            onPress={action}
        >
            {leftIcon}
            <Text style={Styles.tabText}>{text}</Text>
            {rightIcon}
        </TouchableOpacity>
    )
};

// reusable tab component for Selections
const Select = ({text, selected, action, leftIcon, rightIcon}) =>
{
    return(
        <TouchableOpacity
            style={[Styles.tabWrapper, selected ? {backgroundColor: Colors.secondary} : null]}
            onPress={action}
        >
            {leftIcon}
            <Text style={[Styles.tabText, selected ? {color: Colors.text} : null]}>{text}</Text>
            {rightIcon}         
        </TouchableOpacity>
    )
};

// format number for readability
const formatNumber = (phone) =>
{
    const clean = phone.replace(/\D/g, '').slice(-10);
    const match = clean.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return `(${match[1]}) ${match[2]} - ${match[3]}`;
    }
    return phone;
};

// format date for readability
const formatDate = (dateString) =>
{
    let date;

    if (dateString.includes('T')) {
        date = new Date(dateString);
    } else {
        const [year, month, day] = dateString.split('-');
        date = new Date(year, month - 1, day);
    }
    
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

// format time for readability
const formatTime = (timeString) =>
{
    const today = new Date().toISOString().split('T')[0];
    const time = new Date(`${today}T${timeString}`);

    return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
};

const TowStatusComponent = ({towRequest, client, setTowRequest}) =>
{
    return (
        <>
            { towRequest && towRequest.status === "PENDING"? (
            <>
                <View style={Styles.infoContainer}>
                    <View style={ServiceStyles.titleWrapper}>
                        <Text style={[Styles.title, {textAlign: 'left'}]}>Tow Request</Text>
                        <FontAwesome name="check" size={30} color='white'/>
                    </View>
                    <Text style={Styles.subTitle}>Price:</Text>
                    <Text style={Styles.text}>{towRequest.price}</Text>
                    <Text style={Styles.subTitle}>Wait Time:</Text>
                    <Text style={Styles.text}>{towRequest.waitTime}</Text>
                </View>
                <View style={[Styles.block, {alignItems: 'center'}]}>
                    <TouchableOpacity
                        style={Styles.actionButton}
                        onPress={() => Alert.alert(
                            'Confirm',
                            'Are you sure you want to accept this tow request?',
                            [
                                { text: 'No' },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        handleSendAdminNotif('Tow Request Confirmed', 'Customer has been confirmed for towing!');
                                        handleUpdateTowRequestStatus(client, towRequest.id, 'IN_PROGRESS', setTowRequest);
                                        Alert.alert(
                                            'Confirmed',
                                            'Your tow request has been confirmed',
                                            [{ text: 'OK' }]
                                        );
                                    }
                                }
                            ]
                        )}
                    >
                        <Text style={Styles.actionText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[Styles.actionButton, {backgroundColor: 'red'}]}
                        onPress={() => Alert.alert(
                            'Cancel',
                            'Are you sure you want to cancel this tow request?',
                            [
                                { text: 'No' },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        handleSendAdminNotif('Tow Request Cancelled', 'Customer has cancelled the tow request');
                                        handleUpdateTowRequestStatus(client, towRequest.id, 'CANCELLED', setTowRequest);
                                        Alert.alert(
                                            'Cancelled',
                                            'Your tow request has been cancelled',
                                            [{ text: 'OK' }]
                                        );
                                        setTowRequest(undefined);
                                        router.replace('/(tabs)');
                                    }
                                }
                            ]
                        )}
                    >
                        <Text style={Styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </>
            ) : towRequest && towRequest.status === "REQUESTED" ? (
            <>
                <View style={Styles.infoContainer}>
                    <View style={ServiceStyles.titleWrapper}>
                    <Text style={Styles.subTitle}>Tow Request</Text>
                    <LottieView
                        source={require('../assets/animations/gear.json')}
                        loop
                        autoPlay
                        style={{width: 50, height: 50}}
                    />
                    </View>
                    <Text style={Styles.text}>
                    Your request is being processed.
                    We'll notify you with a price and estimated wait time shortly.
                    </Text>
                </View>
                <View style={Styles.block}>
                    <TouchableOpacity
                        style={[Styles.actionButton, {backgroundColor: 'red', alignSelf: 'center'}]}
                        onPress={() => Alert.alert(
                            'Cancel',
                            'Are you sure you want to cancel your tow request?',
                            [
                                { text: 'NO' },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        handleSendAdminNotif('Tow Request Cancelled', 'Customer has cancelled the tow request');
                                        await handleUpdateTowRequestStatus(client, towRequest.id, 'CANCELLED', setTowRequest);
                                        Alert.alert(
                                            'Cancelled',
                                            'Your tow request has been cancelled',
                                            [{ text: 'OK' }]
                                        );
                                        setTowRequest(undefined);
                                        router.replace('/(tabs)');
                                    }
                                }
                            ]
                        )}
                    >
                        <Text style={Styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </>
            ) : towRequest?.status === "IN_PROGRESS" ? (
            <View style={Styles.infoContainer}>
                <View style={ServiceStyles.titleWrapper}>
                    <Text style={Styles.subTitle}>Tow Request</Text>
                    <LottieView
                        source={require('../assets/animations/truck.json')}
                        loop
                        autoPlay
                        style={{width: 75, height: 75}}
                    />
                </View>
                <Text style={Styles.text}>
                Your driver is on the way!
                Estimated Wait time is {towRequest.waitTime}.
                </Text>
            </View>
            ) : null}
        </>
    );
};

const AppointmentReminder = ({appointments}) =>
{
    const [ index, setIndex ] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if(!appointments || appointments?.length <= 1) return;

        const interval = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setIndex((prevIndex) => (prevIndex + 1) % appointments.length);

                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
        }, 4000)

        return () => clearInterval(interval);
    }, [appointments]);

    if (!appointments || appointments?.length === 0) return null;

    const current = appointments[index];
    return (
        <View style={HomeStyles.appointmentContainer}>
            <Text style={HomeStyles.appointmentTitle}>Appt. Reminder</Text>
            <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={HomeStyles.appointmentText}>{formatDate(current.date)}</Text>
                <Text style={HomeStyles.appointmentText}>{formatTime(current.time)}</Text>
            </Animated.View>
        </View>
    );
};

const handleDeleteStorage = async (identityId) =>
{
    try {
        const files = await list({
            path: `protected/${identityId}/`,
        });

        await Promise.all(
            files.items.map((file) =>
                remove({ path: file.path})
            )
        );

    } catch (error) {
        console.log('Error deleting storage:', error);
    }
};

export {
    Loading,
    CustHeader,
    AuthBackground,
    Background,
    BackgroundAlt,
    CalendarHeader,
    Tab,
    Select,
    formatNumber,
    formatDate,
    formatTime,
    TowStatusComponent,
    AppointmentReminder,
    handleDeleteStorage
};