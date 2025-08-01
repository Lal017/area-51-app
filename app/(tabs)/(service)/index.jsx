import LottieView from "lottie-react-native";
import Colors from "../../../constants/colors";
import { useApp } from "../../../components/context";
import { Background } from "../../../components/components";
import { ServiceStyles, Styles } from "../../../constants/styles";
import { router } from "expo-router";
import { requestForegroundPermissionsAsync } from "expo-location";
import { Text, TouchableOpacity, Alert, View, Linking } from "react-native";

const ServiceConsole = () =>
{
  const { towRequest, vehicles } = useApp();

  return (
    <Background style={{rowGap: 5}}>
      <TouchableOpacity
        onPress={async () => {
          if (vehicles.length === 0) {
            Alert.alert(
              'Notice',
              'Please add a vehicle before continuing',
              [
                { text: 'Cancel' },
                {
                  text: 'Add Vehicle',
                  onPress: () => router.push('/vehicleList')
                }
              ]
            );
            return;
          }
          const { status } = await requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert(
              'NOTICE',
              'You must give location permissions to make a tow request',
              [
                {
                  text: 'Settings',
                  onPress: () => Linking.openSettings()
                }
              ]
            );
            return;
          }
          if (towRequest !== undefined) {
            router.push('/towStatus');
          } else {
            router.push('/towRequest');
          }
        }}
        style={[Styles.consoleBubble, {backgroundColor: Colors.secondary}]}
      >
        <Text style={ServiceStyles.title}>Request a tow</Text>
        <LottieView
          source={require('../../../assets/animations/ufo.json')}
          loop
          autoPlay
          style={ServiceStyles.lottieAnim}
          speed={0.5}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (vehicles.length === 0) {
            Alert.alert(
              'Notice',
              'Please add a vehicle before continuing',
              [
                { text: 'Cancel' },
                {
                  text: 'Add Vehicle',
                  onPress: () => router.push('/vehicleList')
                }
              ]
            );
          } else {
            router.push('/schedule');
          }
        }}
        style={[Styles.consoleBubble, {backgroundColor: Colors.tertiary}]}
      >
        <Text style={ServiceStyles.title}>Schedule an Appointment</Text>
        <View style={[ServiceStyles.lottieAnim, {justifyContent: 'center', alignItems: 'center'}]}>
          <LottieView
            source={require('../../../assets/animations/calendar.json')}
            loop
            autoPlay
            style={{width: 250, height: 250}}
            speed={0.5}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/(service)/myAppointments')}
        style={[Styles.consoleBubble, {backgroundColor: Colors.primary}]}
      >
        <Text style={ServiceStyles.title}>Appointments</Text>
        <View style={[ServiceStyles.lottieAnim, {justifyContent: 'center', alignItems: 'center'}]}>
          <LottieView
            source={require('../../../assets/animations/calendarCheck.json')}
            loop
            autoPlay
            style={{width: 100, height: 100}}
          />
        </View>
      </TouchableOpacity>
    </Background>
  );
}

export default ServiceConsole;