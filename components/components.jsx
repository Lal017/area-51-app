import Colors from '../constants/colors';
import React from 'react';
import { useApp } from './context';
import { formatDate, formatTime } from '../constants/utils';
import { Styles, HomeStyles } from '../constants/styles';
import { View, Text, TouchableOpacity, ScrollView, Animated as RNAnimated, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { signOut } from '@aws-amplify/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

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
    const insets = useSafeAreaInsets();

    return (
        <View style={[Styles.HeaderContainer, {paddingTop: insets.top}]}>
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
        </View>
    );
};

// wraps the (auth) pages
const AuthBackground = ({children}) =>
{
    const insets = useSafeAreaInsets();
    return (
        <LinearGradient
            style={{flex: 1, paddingBottom: insets.bottom, paddingTop: insets.top}}
            colors={[Colors.background, Colors.backgroundShade, Colors.backgroundShade]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
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
const Background = ({children, style, refreshing, onRefresh, scrollRef, hasNoHeader = false, hasTab = true}) =>
{
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            style={[{flex: 1}, hasNoHeader && {paddingTop: insets.top}, !hasTab && {paddingBottom: insets.bottom}]}
            colors={[Colors.backgroundShade, Colors.background, Colors.backgroundShade]}
            locations={[0.1, 0.5, 0.9]}
            start={{x: 1, y: 0.9}}
            end={{x: 0, y: 0.4}}
            dither={false}
        >
            <ScrollView
                contentContainerStyle={[Styles.page, style]}
                keyboardShouldPersistTaps='handled'
                ref={scrollRef}
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
const BackgroundAlt = ({children, style, hasNoHeader = false, hasTab = false}) =>
{
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            style={[{flex: 1}, hasNoHeader && {paddingTop: insets.top}, hasTab && {paddingBottom: insets.bottom}, style]}
            colors={[Colors.backgroundShade, Colors.background, Colors.backgroundShade]}
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
const Tab = ({header, text, action, leftIcon, rightIcon, style}) =>
{
    return(
        <TouchableOpacity
            style={[Styles.tabWrapper, style]}
            onPress={action}
        >
            {leftIcon}
            <View style={!header ? {flexDirection: 'row'} : {flexDirection: 'column'}}>
                <Text style={Styles.tabHeader}>{header}</Text>
                <Text style={Styles.tabText}>{text}</Text>
            </View>
            {rightIcon}
        </TouchableOpacity>
    );
};

// reusable tab component for Selections
const Select = ({header, text, selected, action, leftIcon, rightIcon, style}) =>
{
    return(
        <TouchableOpacity
            style={[Styles.tabWrapper, style, {width: '90%', borderRadius: 10, alignSelf: 'center'}, selected && {backgroundColor: Colors.secondary}]}
            onPress={action}
        >
            <LinearGradient
                colors={[Colors.backgroundContrast, Colors.backgroundContrastShade, Colors.backgroundContrastShade]}
                start={{ x: 0, y: 0}}
                end={{ x: 0, y: 1}}
                style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, borderRadius: 10}}
            />
            {leftIcon}
            <View style={!header ? {flexDirection: 'row'} : {flexDirection: 'column'}}>
                <Text style={[Styles.tabHeader, selected && {color: Colors.text}]}>{header}</Text>
                <Text style={Styles.tabText}>{text}</Text>
            </View>
            {rightIcon}         
        </TouchableOpacity>
    )
};

// reusable tab component for Binary Selections
const BinarySelect = ({trueText, falseText, value, onChange}) =>
{
    return(
        <View style={Styles.binaryTabContainer}>
            <TouchableOpacity
                style={[Styles.binaryTabWrapper, value && {padding: 15, backgroundColor: Colors.secondary}]}
                onPress={() => onChange(true)}
            >
                <Text style={[Styles.tabText, {textAlign: 'center'}]}>{trueText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[Styles.binaryTabWrapper, value === false && {padding: 15, backgroundColor: Colors.error}]}
                onPress={() => onChange(false)}
            >
                <Text style={[Styles.tabText, {textAlign: 'center'}]}>{falseText}</Text>
            </TouchableOpacity>
        </View>
    );
};

// component for home page to show a reminder for upcoming appointments
const AppointmentReminder = ({appointments}) =>
{
    const [ index, setIndex ] = useState(0);
    const fadeAnim = useRef(new RNAnimated.Value(1)).current;

    const shimmer = useSharedValue(-5);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
            -1,
            false
        );
    }, [appointments]);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmer.value * 300}]
    }));

    useEffect(() => {
        if(!appointments || appointments?.length <= 1) return;

        const interval = setInterval(() => {
            RNAnimated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setIndex((prevIndex) => (prevIndex + 1) % appointments.length);

                RNAnimated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [appointments]);

    if (!appointments || appointments?.length === 0) return null;

    const current = appointments[index];
    if (!current) return null;
    return (
        <TouchableOpacity
            style={[HomeStyles.appointmentContainer, {overflow: 'hidden'}]}
            onPress={() => router.push('myAppointments')}
        >
            <LinearGradient
                colors={[Colors.backgroundContrast, Colors.backgroundContrastShade, Colors.backgroundContrastShade]}
                start={{ x: 1, y: 0}}
                end={{ x: 0, y: 1}}
                style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}
            />
            <Animated.View
            style={[shimmerStyle, {
                position: 'absolute',
                top: 0, bottom: 0,
                width: '500%',
            }]}
            >
            <LinearGradient
                colors={['transparent', Colors.backgroundContrast, 'transparent']}
                style={{flex: 1}}
                start={{ x: 0, y: 0}}
                end={{ x: 1, y: 0}}
            />
            </Animated.View>
            <Text style={HomeStyles.appointmentTitle}>Appt. Reminder</Text>
            <RNAnimated.View style={{ opacity: fadeAnim }}>
                <Text style={HomeStyles.appointmentText}>{formatDate(current.date)}</Text>
                <Text style={HomeStyles.appointmentText}>{formatTime(current.time)}</Text>
            </RNAnimated.View>
        </TouchableOpacity>
    );
};

// resuable list component without virtualization
const SimpleList = ({data = [], renderItem}) =>
{
    return(
        <>
            {data.map((item, index) => (
                <React.Fragment key={index}>
                    {renderItem({ item })}
                </React.Fragment>
            ))}
        </>
    )
};

// floating block used to contain information
const FloatingBlock = ({ children, glareTop = false }) =>
{
    return(
        <View style={Styles.floatingBlock}>
            <LinearGradient
                colors={[Colors.backgroundContrast, Colors.backgroundContrastShade, Colors.backgroundContrastShade]}
                start={{x: 0, y: glareTop ? 0 : 1}}
                end={{x: 0, y: glareTop ? 1 : 0}}
                style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
            />
            {children}
        </View>
    );
};

const ActionButton = ({text, onPress, primaryColor = Colors.button, secondaryColor = Colors.buttonShade, icon}) =>
{
    const [ loading, setLoading ] = useState(false);

    return(
        <TouchableOpacity
            onPress={async () => {
                if(loading) return;
                setLoading(true);
                await onPress();
                setLoading(false);
            }}
            style={[Styles.actionButton, {overflow: 'hidden'}, loading && { opacity: 0.5 }]}
            disabled={loading}
        >
            <LinearGradient
                colors={[primaryColor, secondaryColor]}
                start={{ x: 0, y: 0}}
                end={{ x: 0, y: 1}}
                style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, height: '100%'}}
            />
            {icon}
            <Text style={Styles.actionText}>{text}</Text>
        </TouchableOpacity>
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
    AppointmentReminder,
    SimpleList,
    FloatingBlock,
    ActionButton
};