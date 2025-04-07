import { View, Text, TouchableOpacity, Modal, KeyboardAvoidingView, StatusBar, TextInput } from "react-native";
import { HomeStyles, AuthStyles } from "../../constants/styles";
import { useState, useEffect } from "react";
import { fetchUserAttributes } from 'aws-amplify/auth';
import { handleUpdatePhone } from '../../components/authComponents';

// Home page after login
const Index = () =>
{
  const [phoneNumber, setPhoneNumber] = useState();
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
      await handleUpdatePhone(phoneNumber);
      setIsPhoneUpdated(prev => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={HomeStyles.page}>
      <Modal
        visible={showModal}
        animationType='slide'
      >
        <KeyboardAvoidingView behavior='height' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <StatusBar barStyle="light-content" hidden={true}/>
          <View style={[AuthStyles.backgroundContainer, {height: '100%'}]}>
            <View style={AuthStyles.background} />
            <View style={AuthStyles.background} />
            <View style={AuthStyles.background} />
            <View style={AuthStyles.background} />
          </View>
          <View style={AuthStyles.container}>
              <Text style={AuthStyles.title}>Add Phone Number</Text>
              <TextInput
                  style={AuthStyles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
              />
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
        <Text style={{color: 'white', textAlign: 'center'}}>Need a locksmith?</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Index;