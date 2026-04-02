import Colors from '../constants/colors';
import React from 'react';
import { useApp } from '../hooks/useApp';
import { formatDate, formatTime } from '../utils/utils';
import { handleSignInWithRedirect } from '../services/authService';
import { Styles, HomeStyles } from '../constants/styles';
import { View, Image, Text, TouchableOpacity, ScrollView, Animated as RNAnimated, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome, MaterialIcons, FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { signOut } from '@aws-amplify/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import useShimmer from '../hooks/useShimmer';

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
        <View style={{
            justifyContent: 'center', alignItems: 'center',
            flexDirection: 'row',
            position: 'relative',
            backgroundColor: Colors.backgroundShade,
            paddingTop: insets.top, padding: 5
            }}
        >
            { !index && !isStuck && router.canGoBack() && (
                <TouchableOpacity
                    style={{position: 'absolute', left: 20, paddingTop: insets.top, justifyContent: 'center'}}
                    onPress={() => router.back()}
                >
                    <AntDesign name='left' size={30} color='white' />
                </TouchableOpacity>
            )}
            <Text style={[Styles.headerTitle, {textAlign: 'center'}]}>{title}</Text>
            {(title === 'Settings' || title === 'Profile') && (
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        right: 20,
                        justifyContent: 'center',
                        paddingTop: insets.top
                    }}
                    onPress={async () => {
                        if (loading) return;
                        setLoading(true);
                        try {
                            await signOut({global: true });
                        } catch (error) {
                            console.error('ERROR, could not sign out', error);
                        }
                        setLoading(false);
                    }}
                    disabled={loading}
                >
                    <MaterialIcons name='logout' size={30} color={loading ? 'gray' : 'white'}/>
                </TouchableOpacity>
            )}
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
                    onRefresh && <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
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
        <View>
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
        <View style={{
            flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center',
            height: 50
        }}>
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

    const shimmerStyle = useShimmer(appointments, 5000);

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
            style={{
                flex: 1,
                minWidth: '40%',
                maxHeight: '100%',
                borderRadius: 10,
                paddingHorizontal: 25, paddingVertical: 10,
                overflow: 'hidden'
            }}
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
        <View style={{rowGap: 5}}>
            {data.map((item, index) => (
                <React.Fragment key={index}>
                    {renderItem({ item })}
                </React.Fragment>
            ))}
        </View>
    )
};

// floating block used to contain information
const FloatingBlock = ({ children, glareTop = false }) =>
{
    return(
        <View style={{
            width: '90%',
            paddingBottom: 20, paddingTop: 20,
            rowGap: 20,
            marginBottom: 20,
            borderRadius: 15,
            overflow: 'hidden',
            borderWidth: 1, borderColor: Colors.backgroundContrast
        }}>
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

const ErrorDisplay = ({message}) =>
{
    return(
        <View style={Styles.block}>
            <View style={Styles.errorContainer}>
                <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: Colors.errorMessage}]}/>
                <Text style={[Styles.text, {color: Colors.errorMessage}]}>{message}</Text>
            </View>
        </View>
    );
};

const DropDownTab = ({ parentTab, childTabs }) =>
{
    const expandedHeight = useSharedValue(0);
    const toggleExpand = () => expandedHeight.value = expandedHeight.value === 0 ? 500 : 0;

    const animatedStyle = useAnimatedStyle(() => ({
        maxHeight: withSpring(expandedHeight.value),
        overflow: 'hidden'
    }));

    return (
        <>
            {parentTab(toggleExpand)}
            <Animated.View style={animatedStyle}>
                <View style={{position: 'relative', paddingLeft: 20}}>
                    {childTabs.map((tab, index) => {
                        const isLast = index === childTabs.length - 1;
                        return(
                            <View key={index} style={{ position: 'relative'}}>
                                <View style={{
                                    position: 'absolute',
                                    left: 10, top: 0,
                                    width: 1, height: isLast ? '50%' : '100%',
                                    backgroundColor: Colors.grayText
                                }}/>
                                <View style={{
                                    position: 'absolute',
                                    left: 10, top: '50%',
                                    width: 20, height: 1,
                                    backgroundColor: Colors.grayText,
                                }}/>
                                {tab}
                            </View>
                        )
                    })}
                </View>
            </Animated.View>
        </>
    )
};

const SubTab = ({header, text, icon}) =>
{
    return(
        <View style={{
            width: '90%', height: 75,
            alignItems: 'center', alignSelf: 'flex-end',
            paddingLeft: 70,
            flexDirection: 'row',
            position: 'relative'
        }}>
            {icon}
            <View style={!header ? {flexDirection: 'row'} : {flexDirection: 'column'}}>
                <Text style={Styles.tabHeader}>{header}</Text>
                <Text style={Styles.tabText}>{text}</Text>
            </View>
        </View>
    );
};

// auth
// Google sign in button component
const GoogleSignInButton = ({text}) =>
{
    return(
        <TouchableOpacity
            onPress={() => handleSignInWithRedirect('Google')}
            style={{
                backgroundColor: 'white',
                width: '100%',
                padding: 10,
                borderRadius: 25,
                flexDirection: 'row',
                columnGap: 10,
                alignItems: 'center', justifyContent: 'center',
            }}
        >
            <Image
                source={require('../assets/images/google-icon.png')}
                style={{height: 25, width: 25}}
            />
            <Text style={{fontFamily: 'Roboto-Regular', fontSize: 17}}>{text}</Text>
        </TouchableOpacity>
    );
};

// appointments
// used to return the correct icon for a selected service
const iconCheck = (service) =>
{
    switch (service) {
        case 'Oil Change':
            return <FontAwesome5 name="oil-can" size={30} style={Styles.icon}/>;
        case 'Diagnosis':
            return <FontAwesome name="stethoscope" size={30} style={Styles.icon}/>;
        case 'Tuning':
            return <Entypo name="area-graph" size={30} style={Styles.icon}/>;
        case 'A/C':
            return <MaterialIcons name="air" size={30} style={Styles.icon}/>;
        case 'Vehicle Pickup':
            return <MaterialCommunityIcons name='car-clock' size={30} style={Styles.icon}/>;
        default:
            return <MaterialCommunityIcons name="dots-horizontal-circle" size={30} style={Styles.icon}/>;
    }
};

// tow
const getStatus = (status) =>
{
    switch (status) {
        case 'COMPLETED':
            return <Text style={Styles.tabText}>Completed</Text>;
        case 'IN_PROGRESS':
            return <Text style={[Styles.tabText, {color: Colors.primary}]}>In Progress</Text>;
        case 'CANCELLED':
            return <Text style={[Styles.tabText, {color: Colors.error}]}>Cancelled</Text>;
        case 'REQUESTED':
            return <Text style={[Styles.tabText, {color: Colors.secondary}]}>Requested</Text>;
        default:
            return <Text>N/A</Text>
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
    BinarySelect,
    AppointmentReminder,
    SimpleList,
    FloatingBlock,
    ActionButton,
    ErrorDisplay,
    DropDownTab,
    SubTab,
    GoogleSignInButton,
    iconCheck,
    getStatus
};