import {
    getPermissionStatus,
    requestPermissions,
    onNotificationReceivedInForeground,
    onNotificationReceivedInBackground
} from 'aws-amplify/push-notifications';

// permission to send push notifications
const handlePermissions = async () =>
{
    const status = await getPermissionStatus();
    console.log(status);

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

export {
    handlePermissions
};