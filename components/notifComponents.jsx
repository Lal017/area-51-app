import { Alert } from 'react-native';
import Notifications from 'expo-notifications';
import Device from 'expo-device';
import Constants from 'expo-constants';

const sendPushNotification = async (expoPushToken) =>
{
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Test Notification',
        body: 'trop test notification worked!',
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        metho: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
};

const handleRegistrationError = (errMessage) =>
{
    Alert.alert(
        'Registration Error',
        errMessage,
        [
            { text: 'OK' }
        ]
    );
    throw new Error(errMessage);
};

const registerForPushNotifications = async () =>
{
    Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
    });

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission was not granted to get token');
            return;
        }
        
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (error) {
            handleRegistrationError(error.message);
        }
    } else {
        handleRegistrationError('Must use physical device for Push Notifications');
    }
};

export {
    registerForPushNotifications,
    sendPushNotification
};