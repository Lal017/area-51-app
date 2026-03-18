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

export {
    callUser,
    textUser,
    openInMaps,
    textSize
}