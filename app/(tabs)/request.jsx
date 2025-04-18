import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState} from "react";
import { RequestStyles } from "../../constants/styles";
import { findEntry, handleListPushToken, sendPushNotification } from "../../components/notifComponents";
import Colors from "../../constants/colors";
import { useApp } from "../../components/context";

const Request = () =>
{
  const { client, pushToken, notification } = useApp();
  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  return (
      <ScrollView contentContainerStyle={RequestStyles.page}>
        <View style={RequestStyles.container}>
          <TextInput
            placeholder="Title"
            style={RequestStyles.inputTitle}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            placeholder="Message"
            style={RequestStyles.inputMessage}
            value={body}
            onChangeText={setBody}
            multiline={true}
          />
          <TouchableOpacity
            style={RequestStyles.actionButton}
            onPress={() => sendPushNotification(pushToken, title, body)}
          >
            <Text style={{textAlign: 'center', color: 'white'}}>Send</Text>
          </TouchableOpacity>
        </View>
        <View style={RequestStyles.container}>
          <Text style={RequestStyles.title}>Request</Text>
          <View style={RequestStyles.messageContainer}>
            <Text style={{color: Colors.text}}>Title: {notification && notification.request.content.title} </Text>
            <Text style={{color: Colors.text}}>Body: {notification && notification.request.content.body}</Text>
            <Text style={{color: Colors.text}}>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={RequestStyles.actionButton}
          onPress={() => handleListPushToken(client)}
        >
          <Text style={{textAlign: 'center', color: 'white'}}>Retrieve data</Text>
        </TouchableOpacity>
      </ScrollView>
  )
}

export default Request;