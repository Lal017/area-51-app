import { View, Text, TouchableOpacity, Modal, KeyboardAvoidingView, TextInput, StatusBar, ScrollView } from "react-native";
import { HomeStyles, Styles } from "../../../constants/styles";
import { useState, useEffect } from "react";
import { fetchUserAttributes } from 'aws-amplify/auth';
import { handleUpdatePhone } from '../../../components/authComponents';
import { useApp } from "../../../components/context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";

// Home page after login
const Index = () =>
{
  const { setPhoneNumber, request, notification, clearNotification } = useApp();

  const [newPhoneNumber, setNewPhoneNumber] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isPhoneUpdated, setIsPhoneUpdated] = useState(false);

  // Check if user has phone number attribute set. if not, prompt user for phone number
  useEffect(() => {
    const checkPhone = async () => {
      try {
        const user = await fetchUserAttributes();

        // False if phone number exists || true if phone number doesn't exist
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
    <ScrollView contentContainerStyle={[Styles.page, {justifyContent: 'flex-start'}]}>
      <StatusBar hidden={true}/>
      <Modal
        visible={showModal}
        animationType='slide'
      >
        <KeyboardAvoidingView behavior='height' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={Styles.container}>
              <Text style={Styles.title}>Add Phone Number</Text>
              <View style={Styles.inputWrapper}>
                <Ionicons name="call" size={20} style={Styles.icon} />
                <TextInput
                    style={Styles.input}
                    value={newPhoneNumber}
                    onChangeText={setNewPhoneNumber}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                />
              </View>
              <TouchableOpacity
                  onPress={() => handleSubmit()}
                  style={Styles.actionButton}
              >
                  <Text style={Styles.actionText}>Submit</Text>
              </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      { !request ? (
        <TouchableOpacity
          onPress={() => router.push('towRequest')}
          style={HomeStyles.towButton}
        >
          <Text style={[Styles.title, {color: 'white'}]}>Request a tow</Text>
          <LottieView
            source={require('../../../assets/animations/ufo.json')}
            loop
            autoPlay
            style={{width: 100, height: 100}}
            speed={0.5}
          />
        </TouchableOpacity>
      ) : request && notification ? (
        <View style={HomeStyles.notifWrapper}>
          <View style={[HomeStyles.titleWrapper, {columnGap: 10}]}>
            <Text style={Styles.subTitle}>Tow Request</Text>
            <FontAwesome name="check" size={25} color='black'/>
          </View>
          <Text style={Styles.subTitle}>Price:</Text>
          <Text style={Styles.text}>{notification.data.price}</Text>
          <Text style={Styles.subTitle}>Wait Time:</Text>
          <Text style={Styles.text}>{notification.data.waitTime}</Text>
          <TouchableOpacity
            onPress={clearNotification}
          >
            <Text>remove notification</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={HomeStyles.notifWrapper}>
          <View style={HomeStyles.titleWrapper}>
            <Text style={Styles.subTitle}>Tow Request</Text>
            <LottieView
              source={require('../../../assets/animations/gear.json')}
              loop
              autoPlay
              style={{width: 50, height: 50}}
            />
          </View>
          <Text style={Styles.text}>
            Your request is being processed.
            We'll notify you with a price and estimated wait time shortly.
          </Text>
          <TouchableOpacity
            onPress={clearNotification}
          >
            <Text>remove notification</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

export default Index;