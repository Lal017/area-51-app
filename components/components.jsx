import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Styles, ScheduleStyles } from '../constants/styles';
import Colors from '../constants/colors';

// custom header component to replace default header
const CustHeader = ({title}) =>
{
    return (
        <View style={Styles.HeaderContainer}>
            <Text style={Styles.title}>{title}</Text>
        </View>
   
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
const Tab = ({text, action}) =>
{
    return(
        <View style={Styles.tab}>
            <TouchableOpacity
                style={Styles.tabButton}
                onPress={action}
            >
                <Text>{text}</Text>            
            </TouchableOpacity>
        </View>
    )
};

// reusable tab component for Selections
const Select = ({text, selected, action}) =>
{
    return(
        <View style={Styles.tab}>
            <TouchableOpacity
                style={[Styles.tabButton, {borderRadius: 50}, selected ? {backgroundColor: Colors.secondary} : null]}
                onPress={action}
            >
                <Text style={selected ? {color: Colors.text} : null}>{text}</Text>            
            </TouchableOpacity>
        </View>
    )
};

//redirects to the trop locksmith website
const socialRedirect = (link) =>
{
    Linking.openURL(link);
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
    CalendarHeader,
    Tab,
    Select,
    socialRedirect,
    formatNumber,
    formatDate,
    formatTime
};