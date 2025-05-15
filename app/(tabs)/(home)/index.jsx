import { View, Text, TouchableOpacity, StatusBar, ScrollView } from "react-native";
import { HomeStyles, Styles } from "../../../constants/styles";
import { useApp } from "../../../components/context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { handleUpdateTowRequestReply } from "../../../components/scheduleComponents";
import { handleSendAdminNotif } from "../../../components/notifComponents";

// Home page after login
const Index = () =>
{
  const { towRequest, client, setTowRequest } = useApp();

  return (
    <ScrollView contentContainerStyle={[Styles.page, {justifyContent: 'flex-start'}]}>
      <StatusBar hidden={true}/>
      { !towRequest ? (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/(home)/towRequest')}
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
      ) : towRequest && towRequest.status === "PENDING"? (
        <View style={HomeStyles.notifWrapper}>
          <View style={[HomeStyles.titleWrapper, {columnGap: 10}]}>
            <Text style={Styles.subTitle}>Tow Request</Text>
            <FontAwesome name="check" size={25} color='black'/>
          </View>
          <Text style={Styles.subTitle}>Price:</Text>
          <Text style={Styles.text}>{towRequest.price}</Text>
          <Text style={Styles.subTitle}>Wait Time:</Text>
          <Text style={Styles.text}>{towRequest.waitTime}</Text>
          <View style={HomeStyles.buttonContainer}>
            <TouchableOpacity
              style={Styles.actionButton}
              onPress={() => {
                handleSendAdminNotif('Tow Request', 'Customer has been confirmed for towing!');
                handleUpdateTowRequestReply(client, towRequest.id, 'IN_PROGRESS', setTowRequest);
              }}
            >
              <Text style={Styles.actionText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[Styles.actionButton, {backgroundColor: 'red'}]}
              onPress={() => {
                handleSendAdminNotif('Tow Request', 'Customer has cancelled the tow request');
                handleUpdateTowRequestReply(client, towRequest.id, 'CANCELLED', setTowRequest)
              }}  
            >
              <Text style={Styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : towRequest && towRequest.status === "REQUESTED" ? (
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
        </View>
      ) : towRequest && towRequest.status === "IN_PROGRESS" ? (
        <View style={HomeStyles.notifWrapper}>
          <View style={HomeStyles.titleWrapper}>
            <Text style={Styles.subTitle}>Tow Request</Text>
            <LottieView
              source={require('../../../assets/animations/truck.json')}
              loop
              autoPlay
              style={{width: 75, height: 75}}
            />
          </View>
          <Text style={Styles.text}>
            Your driver is on the way!
            Estimated Wait time is {towRequest.waitTime}.
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

export default Index;