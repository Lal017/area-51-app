import { Text, TouchableOpacity, Linking, View, Alert, Image } from "react-native";
import { router } from "expo-router";
import { AppointmentReminder, Background } from "../../../components/components";
import { HomeStyles, Styles } from "../../../constants/styles";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useApp } from "../../../components/context";
import Animated, { Easing , useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import Colors from "../../../constants/colors";

// Home page after login
const Index = () =>
{
  const { firstName, towRequest, vehicles, appointments } = useApp();

  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(-10, {
          duration: 500,
          easing: Easing.out(Easing.ease)
        }),
        withTiming(0, {
          duration: 500,
          easing: Easing.in(Easing.ease)
        })
      ),
      -1,     // infinite
      true,   // reverse
    );
  }, [towRequest]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }]
  }));
  
  return (
    <Background>
      <View style={Styles.block}>
        <View style={HomeStyles.shortcutContainer}>
          <TouchableOpacity
            style={HomeStyles.shortcutButton}
            onPress={() => {
              if (vehicles.length === 0) {
                Alert.alert(
                  'Notice',
                  'Please add a vehicle before continuing',
                  [
                    { text: 'Cancel' },
                    {
                      text: 'Settings',
                      onPress: () => router.push('/vehicleList')
                    }
                  ]
                );
              } else {
                if (towRequest !== undefined) {
                  router.push('/towStatus');
                } else {
                  router.push('/towRequest');
                }
              }
            }}
          >
            { towRequest?.status === 'PENDING' ? (
              <Animated.View style={[HomeStyles.activityContainer, animatedStyle, {backgroundColor: Colors.tertiary}]}>
                  <Text style={[Styles.subTitle, {fontSize: 20, textAlign: 'center'}]}>!</Text>
              </Animated.View>
            ) : towRequest?.status === 'REQUESTED' ? (
              <View style={[HomeStyles.activityContainer, {backgroundColor: Colors.secondary}]}/>
            ) : towRequest?.status === 'IN_PROGRESS' ? (
              <View style={[HomeStyles.activityContainer, {backgroundColor: Colors.primary}]}/>
            ) : null }
            <MaterialCommunityIcons name="tow-truck" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={HomeStyles.shortcutButton}
            onPress={() => {
              if (vehicles.length === 0) {
                Alert.alert(
                  'Notice',
                  'Please add a vehicle before continuing',
                  [
                    { text: 'Cancel' },
                    {
                      text: 'Settings',
                      onPress: () => router.push('/vehicleList')
                    }
                  ]
                );
              } else {
                router.push('/schedule');
              }
            }}
          >
            <Entypo name='calendar' size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={HomeStyles.shortcutButton}
            onPress={() => router.push('/vehicleList')}
          >
            <Ionicons name='car-sport' size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={HomeStyles.welcomeContainer}>
        <Text style={Styles.text}>Welcome {firstName}!</Text>
      </View>
      <View style={HomeStyles.panel}>
        <TouchableOpacity
          style={HomeStyles.snapContainer}
          onPress={() => Linking.openURL('https://apply.snapfinance.com/snap-loan/landing?paramId=BEQypIc2AUit0%2BNU%2Fm1jaPTPmNwVgcoBY9btcVvwhMCDJ8qdDYWfFVb5WW%2BxBO51f%2BgPNPmcvPPGEqOKyqcCy57l581i30Mhc54AQ4Uv4I9COQxyDewFNEYSJJRGvQ379a7K2SmTgeFlpEssm%2FParIJh1%2FqwsslQ14TK0wPysRM%2B5wQQIZY5lILxig1G1ms0SOVMj1t76bwiCSSvuzFBeA%3D%3D&source=QR_CODE&merchantId=490307391&lang=en')}
        >
          <Image
            source={require('../../../assets/images/Snap_logo.jpg')}
            style={{resizeMode: 'contain', width: 100}}
          />
        </TouchableOpacity>
      </View>
      <View style={HomeStyles.panel}>
        { appointments?.length > 0 ? (
          <AppointmentReminder appointments={appointments} />
        ) : null}
      </View>
    </Background>
  );
}

export default Index;