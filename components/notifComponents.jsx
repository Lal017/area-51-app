import {
    getPermissionStatus,
    requestPermissions,
} from 'aws-amplify/push-notifications';
import { Alert } from 'react-native';

// permission to send push notifications
const handlePermissions = async () =>
{
    const status = await getPermissionStatus();

    if (status === 'granted') { return; }
    if (status === 'denied') { await permissionRequestExplanation(); return; }
    if (status === 'shouldRequest' || status === 'shouldExplainThenRequest')
    {
        await permissionRequestExplanation();
        await requestPermissions();
    }
};

// explanation to user for permission request
const permissionRequestExplanation = async () =>
{
    Alert.alert(
        'Allow Push Notifications',
        'Note: this app requires push notifications to be enabled.',
        [
            { text: 'Ok' }
        ]
    );
};

const notificationRecievedHandler = async (notification) =>
{
    Alert.alert(
        'Notification Received',
        `Message: ${notification.body}`,
        [
            { text: 'Ok' }
        ]
    )
};

const notificationOpenedHandler = async (notification) =>
{
    console.log('Notification opened:', notification);
    router.replace('(tabs)/profile');
};

export {
    handlePermissions,
    notificationRecievedHandler,
    notificationOpenedHandler
};