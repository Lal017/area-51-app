import { View, Text, TouchableOpacity } from "react-native";
import { Styles } from "../../../constants/styles";
import LottieView from "lottie-react-native";
import Colors from "../../../constants/colors";
import { router } from "expo-router";

const ServiceConsole = () =>
{
  return (
    <View style={[Styles.page, {rowGap: 5}]}>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/(service)/towRequest')}
        style={[Styles.consoleBubble, {backgroundColor: Colors.secondary, height: 225}]}
      >
        <Text style={[Styles.title, {color: Colors.text, position: 'absolute', top: 50}]}>Request a tow</Text>
        <LottieView
          source={require('../../../assets/animations/ufo.json')}
          loop
          autoPlay
          style={{width: 100, height: 100, position: 'absolute', left: 25, top: 110}}
          speed={0.5}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/(service)/schedule')}
        style={[Styles.consoleBubble, {height: 225}]}
      >
        <Text style={[Styles.title, {color: Colors.text, position: 'absolute', top: 40}]}>Schedule an Appointment</Text>
        <LottieView
          source={require('../../../assets/animations/calendar.json')}
          loop
          autoPlay
          style={{width: 200, height: 200, position: 'absolute', right: 165, top: 70, marginRight: 50}}
          speed={0.5}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/(service)/myAppointments')}
        style={[Styles.consoleBubble, {backgroundColor: Colors.primary, height: 225}]}
      >
        <Text style={[Styles.title, {color: Colors.text, position: 'absolute', top: 50}]}>My Appointments</Text>
        <LottieView
          source={require('../../../assets/animations/calendarCheck.json')}
          loop
          autoPlay
          style={{width: 75, height: 75, position: 'absolute', left: 40, top: 110}}
        />
      </TouchableOpacity>
    </View>
  );
}

export default ServiceConsole;