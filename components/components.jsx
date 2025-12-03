import Colors from '../constants/colors';
import { useApp } from './context';
import { Styles, HomeStyles } from '../constants/styles';
import { View, Text, TouchableOpacity, ScrollView, Animated, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { signOut } from '@aws-amplify/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    const [ loading, setLoading ] = useState();

    return (
        <SafeAreaView style={Styles.HeaderContainer}>
            { !index && !isStuck && router.canGoBack() ? (
                <TouchableOpacity
                    style={{position: 'absolute', left: 20, top: 45}}
                    onPress={() => router.back()}
                >
                    <AntDesign name='left' size={30} color='white' />
                </TouchableOpacity>
            ) : null }
            <Text style={[Styles.headerTitle, {textAlign: 'center'}]}>{title}</Text>
            { title === 'Settings' || title === 'Profile' ? (
                <TouchableOpacity
                    style={Styles.signOutButton}
                    onPress={async () => {
                        if (loading) return;
                        setLoading(true);
                        try {
                            await signOut({global: true });
                        } catch (error) {
                            console.error('ERROR, could not sign out', error);
                            Alert.alert(
                                'Error',
                                error.message,
                                [
                                    { text: 'Ok'}
                                ]
                            );
                        }
                        setLoading(false);
                    }}
                    disabled={loading}
                >
                    <MaterialIcons name='logout' size={30} color={loading ? 'gray' : 'white'}/>
                </TouchableOpacity>
            ) : null}
        </SafeAreaView>
    );
};

// wraps the (auth) pages
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

// wraps the page
const Background = ({children, style, refreshing, onRefresh}) =>
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
                refreshControl={
                    onRefresh ? (
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    ) : null
                }
            >
                {children}
            </ScrollView>
        </LinearGradient>
    )
};

// alternative background with no scroll view
const BackgroundAlt = ({children, style}) =>
{
    return (
        <LinearGradient
            style={[{flex: 1, paddingBottom: 50}, style]}
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

// reusable tab component for Binary Selections
const BinarySelect = ({text, selected, action, rightIcon}) =>
{
    return(
        <TouchableOpacity
            style={[Styles.binaryTabWrapper, selected ? {backgroundColor: Colors.secondary} : null]}
            onPress={action}
        >
            <Text style={[Styles.tabText, selected ? {color: Colors.text} : null, {textAlign: 'center'}]}>{text}</Text>
            {rightIcon}     
        </TouchableOpacity>
    )
};

// format phone number for readability
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
    const isValidISODate = !isNaN(Date.parse(timeString));

    const date = isValidISODate
        ? new Date(timeString)
        : new Date(`${new Date().toISOString().split('T')[0]}T${timeString}`);

    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// get remaining time left for tow driver to arrive
const getRemainingETA = (isoStartTime, estimatedMinutes) =>
{
    const start = new Date(isoStartTime); // e.g. "2025-07-09T13:25:00Z"
    const now = new Date();

    const elapsedMs = now - start;
    const elapsedMinutes = Math.floor(elapsedMs / 60000); // Convert ms to minutes

    const remaining = Math.max(estimatedMinutes - elapsedMinutes, 0); // Prevent negative time

    return remaining;
};

// component for home page to show a reminder for upcoming appointments
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

export {
    Loading,
    CustHeader,
    AuthBackground,
    Background,
    BackgroundAlt,
    CalendarHeader,
    Tab,
    Select,
    BinarySelect,
    formatNumber,
    formatDate,
    formatTime,
    getRemainingETA,
    AppointmentReminder
};