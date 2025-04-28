import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState} from "react";
import { RequestStyles } from "../../../constants/styles";
import { handleCustomerRequest } from "../../../components/notifComponents";
import Colors from "../../../constants/colors";
import { useApp } from "../../../components/context";

const Schedule = () =>
{
  const { client, notification } = useApp();

  const [ customerNotes, setCustomerNotes ] = useState();

  return (
      <ScrollView contentContainerStyle={RequestStyles.page}>
        <View style={RequestStyles.container}>
          <Text style={RequestStyles.title}>Need a Tow?</Text>
          <TextInput 
            placeholder="Notes"
            value={customerNotes}
            onChangeText={setCustomerNotes}
            style={RequestStyles.input}
          />
          <TouchableOpacity
            style={RequestStyles.actionButton}
            onPress={() => handleCustomerRequest(client, customerNotes)}
          >
            <Text style={{textAlign: 'center', color: 'white'}}>Send</Text>
          </TouchableOpacity>
        </View>
        <View style={RequestStyles.container}>
          <Text style={RequestStyles.title}>Request</Text>
          <View style={RequestStyles.messageContainer}>
            <Text style={{color: Colors.text}}>Title: {notification && notification.request.content.title} </Text>
            <Text style={{color: Colors.text}}>Body: {notification && notification.request.content.body}</Text>
            <Text style={{color: Colors.text}}>Data: {notification && JSON.stringify(notification?.request?.content?.data?.data)}</Text>
          </View>
        </View>
      </ScrollView>
  )
}

export default Schedule;