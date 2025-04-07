import { TouchableOpacity, View, Text, Button } from "react-native";
import { useEffect, useState, useRef } from "react";
import { ProfileStyles } from "../../constants/styles";
import Notifications from 'expo-notifications';
import { sendPushNotification, registerForPushNotifications } from "../../components/notifComponents";

const Request = () =>
{
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(undefined);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotifications()
    .then(token => setExpoPushToken(token ?? ''))
    .catch((error) => setExpoPushToken(error.message));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
    });

    return () => {
        notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
        responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return (
      <View style={ProfileStyles.page}>
        <Text>Your Expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
          title="Press to Send Notification"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        />
      </View>
  )
}

export default Request;