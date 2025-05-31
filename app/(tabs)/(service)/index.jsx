import { View, Text, TouchableOpacity } from "react-native";
import { Styles } from "../../../constants/styles";
import LottieView from "lottie-react-native";
import Colors from "../../../constants/colors";
import { router } from "expo-router";
import { useApp } from "../../../components/context";

const ServiceConsole = () =>
{
  const { towRequest } = useApp();

  return (
    <View style={[Styles.page, {justifyContent: 'center'}]}>
      <TouchableOpacity
        onPress={() => {
          if (towRequest !== undefined) {
            console.log(towRequest);
            router.push('/(tabs)/(service)/towStatus');
          } else {
            console.log(towRequest);
            router.push('/(tabs)/(service)/towRequest')
          }}}
        style={[Styles.consoleBubble, {backgroundColor: Colors.secondary, height: 225}]}
      >
        <Text style={[Styles.title, {textAlign: 'center', color: Colors.text, position: 'absolute', top: 75}]}>Request a tow</Text>
        <LottieView
          source={require('../../../assets/animations/ufo.json')}
          loop
          autoPlay
          style={{width: 100, height: 100, position: 'absolute', left: 25, top: 120}}
          speed={0.5}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/(service)/schedule')}
        style={[Styles.consoleBubble, {backgroundColor: Colors.tertiary, height: 225}]}
      >
        <Text style={[Styles.title, {textAlign: 'center', paddingLeft: 20, color: Colors.text, position: 'absolute', top: 50}]}>Schedule an Appointment</Text>
        <LottieView
          source={require('../../../assets/animations/calendar.json')}
          loop
          autoPlay
          style={{width: 200, height: 200, position: 'absolute', right: 185, top: 70, marginRight: 50}}
          speed={0.5}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/(service)/myAppointments')}
        style={[Styles.consoleBubble, {backgroundColor: Colors.primary, height: 225}]}
      >
        <Text style={[Styles.title, {textAlign: 'center', color: Colors.text, position: 'absolute', top: 75}]}>My Appointments</Text>
        <LottieView
          source={require('../../../assets/animations/calendarCheck.json')}
          loop
          autoPlay
          style={{width: 75, height: 75, position: 'absolute', left: 40, top: 120}}
        />
      </TouchableOpacity>
    </View>
  );
}

export default ServiceConsole;