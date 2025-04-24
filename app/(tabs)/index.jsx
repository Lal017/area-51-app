import { View, Text, TouchableOpacity, Modal, KeyboardAvoidingView, TextInput, StatusBar } from "react-native";
import { HomeStyles, AuthStyles } from "../../constants/styles";
import { useState, useEffect } from "react";
import { fetchUserAttributes } from 'aws-amplify/auth';
import { handleUpdatePhone } from '../../components/authComponents';
import { useApp } from "../../components/context";
import { Ionicons } from "@expo/vector-icons";

// Home page after login
const Index = () =>
{
  const { setPhoneNumber } = useApp();

  const [newPhoneNumber, setNewPhoneNumber] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isPhoneUpdated, setIsPhoneUpdated] = useState(false);

  // Check if user has phone number attribute set. if not, prompt user for phone number
  useEffect(() => {
    const checkPhone = async () => {
      try {
        const user = await fetchUserAttributes();
        setShowModal(!user.phone_number);
      } catch (error) {
        console.log('fetch user error: ', error);
      }
    };

    checkPhone();
  }, [isPhoneUpdated]);

  // function to set phone number attribute and remove modal if successful
  const handleSubmit = async () =>
  {
    try {
      await handleUpdatePhone(newPhoneNumber, setPhoneNumber);
      setIsPhoneUpdated(prev => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={HomeStyles.page}>
      <StatusBar hidden={true}/>
      <Modal
        visible={showModal}
        animationType='slide'
      >
        <KeyboardAvoidingView behavior='height' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={AuthStyles.container}>
              <Text style={AuthStyles.title}>Add Phone Number</Text>
              <View style={AuthStyles.inputWrapper}>
                <Ionicons name="call" size={20} style={AuthStyles.icon} />
                <TextInput
                    style={AuthStyles.input}
                    value={newPhoneNumber}
                    onChangeText={setNewPhoneNumber}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                />
              </View>
              <TouchableOpacity
                  onPress={() => handleSubmit()}
                  style={AuthStyles.actionButton}
              >
                  <Text style={{color: 'white', textAlign: 'center'}}>Submit</Text>
              </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <TouchableOpacity
        style={HomeStyles.request}
      >
        <Text style={{color: 'white', textAlign: 'center'}}>Send to database</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Index;