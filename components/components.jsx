import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Styles } from '../constants/styles';
import Colors from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

// custom header component to replace default header
const CustHeader = ({title, index}) =>
{
    return (
        <View style={Styles.HeaderContainer}>
            { !index && router.canGoBack() ? (
                <TouchableOpacity
                    style={{position: 'absolute', left: 20, top: 45}}
                    onPress={() => router.back()}
                >
                    <AntDesign name='left' size={30} color='white' />
                </TouchableOpacity>
            ) : null }
            <Text style={[Styles.title, {textAlign: 'center'}]}>{title}</Text>
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
        <ScrollView
            contentContainerStyle={[Styles.page, style, {backgroundColor: Colors.background}]}
        >
            {children}
        </ScrollView>
    )
}

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
            <Text style={Styles.text}>{text}</Text>
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
            <Text style={[Styles.text, selected ? {color: Colors.text} : null]}>{text}</Text>
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
}

export {
    CustHeader,
    AuthBackground,
    Background,
    CalendarHeader,
    Tab,
    Select,
    formatNumber,
    formatDate,
    formatTime
};