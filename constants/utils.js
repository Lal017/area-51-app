import { openURL } from "expo-linking";
import { Dimensions } from "react-native";

// used to call the customer
const callUser = (phone) =>
{
    const url = `tel:${phone}`;
    openURL(url);
};

// used to text the customer
const textUser = (phone) =>
{
    const url = `sms:${phone}`;
    openURL(url);
};

const openInMaps = (latitude, longitude) =>
{
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    openURL(url);
};

// used to get a responsive text size based off of screen size
const { width } = Dimensions.get('window');
const scale = width / 325;
const textSize = (size) => size * scale;

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

export {
    callUser,
    textUser,
    openInMaps,
    textSize,
    formatNumber,
    formatDate,
    formatTime
}