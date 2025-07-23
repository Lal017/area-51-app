import Colors from "../../../constants/colors";
import Carousel from 'react-native-reanimated-carousel';
import { handleGetURLs } from "../../../components/adminComponents";
import { handleGetVehicles } from "../../../components/vehicleComponents";
import { handleGetMyAppointments } from "../../../components/appointmentComponents";
import { handleGetTowRequest } from '../../../components/towComponents';
import { AppointmentReminder, Background } from "../../../components/components";
import { HomeStyles, Styles } from "../../../constants/styles";
import { useApp } from "../../../components/context";
import { Text, TouchableOpacity, Linking, View, Alert, Image, Dimensions, ActivityIndicator } from "react-native";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { Easing , useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useEffect, useState, useRef } from "react";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

// Home page after login
const Index = () =>
{
  const { client, userId, firstName, towRequest, vehicles, appointments, setTowRequest, setAppointments, setVehicles, vehiclePickup } = useApp();
  
  const [ urls, setUrls ] = useState();
  const [ refreshing, setRefreshing ] = useState(false);

  const ref = useRef();
  const bounce = useSharedValue(0);

  const onRefresh = async () =>
  {
    setRefreshing(true);

    try {
      // refresh vehicles
      const getVehicles = await handleGetVehicles(client, userId);
      setVehicles(getVehicles);

      // refresh tow requests
      const getTowRequest = await handleGetTowRequest(client, userId);
      setTowRequest(getTowRequest);

      // refresh appointments
      const getAppointments = await handleGetMyAppointments(client, userId);
      setAppointments(getAppointments);

      // refresh home screen images
      const getUrls = await handleGetURLs();
      setUrls(getUrls);
    } catch (error) {
      console.error('ERROR, could not refresh:', error);
    }

    setRefreshing(false);
  };

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

  useEffect(() => {
    const initUrls = async () =>
    {
      const getUrls = await handleGetURLs();
      setUrls(getUrls);
    }

    initUrls();
  }, []);
  
  return (
    <Background refreshing={refreshing} onRefresh={onRefresh}>
      <View style={Styles.block}>
        <View style={HomeStyles.shortcutContainer}>
          <TouchableOpacity
            style={HomeStyles.shortcutButton}
            onPress={() => {
              if (vehicles?.length === 0) {
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
                if (towRequest !== undefined) {
                  router.push('/towStatus');
                } else {
                  router.push('/towRequest');
                }
              }
            }}
          >
            { towRequest?.status === 'IN_PROGRESS' ? (
              <Animated.View style={[HomeStyles.activityContainer, animatedStyle, {backgroundColor: Colors.primary}]}/>
            ) : towRequest?.status === 'REQUESTED' ? (
              <View style={[HomeStyles.activityContainer, {backgroundColor: Colors.secondary}]}/>
            ) : null }
            <MaterialCommunityIcons name="tow-truck" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={HomeStyles.shortcutButton}
            onPress={() => {
              if (vehicles?.length === 0) {
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
          >
            <Entypo name='calendar' size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={HomeStyles.shortcutButton}
            onPress={() => {
              if (vehiclePickup === true) {
                router.push('vehiclePickup');
              } else {
                router.push('vehicleList');
              }
            }}
          >
            { vehiclePickup ? (
              <Animated.View style={[HomeStyles.activityContainer, animatedStyle, {backgroundColor: Colors.tertiary}]}>
                <Text style={[Styles.subTitle, {fontSize: 20, textAlign: 'center'}]}>!</Text>
              </Animated.View>
            ) : null}
            <Ionicons name='car-sport' size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={HomeStyles.welcomeContainer}>
        <Text style={Styles.text}>Welcome {firstName}!</Text>
        { vehiclePickup ? <Text style={Styles.text}>Your vehicle is ready for pickup!</Text> : null}
      </View>
      <View style={HomeStyles.panel}>
        <TouchableOpacity
          style={[HomeStyles.panelContainer, {backgroundColor: Colors.backDropAccent, minWidth: '40%'}]}
          onPress={() => Linking.openURL('https://apply.snapfinance.com/snap-loan/landing?paramId=BEQypIc2AUit0%2BNU%2Fm1jaPTPmNwVgcoBY9btcVvwhMCDJ8qdDYWfFVb5WW%2BxBO51f%2BgPNPmcvPPGEqOKyqcCy57l581i30Mhc54AQ4Uv4I9COQxyDewFNEYSJJRGvQ379a7K2SmTgeFlpEssm%2FParIJh1%2FqwsslQ14TK0wPysRM%2B5wQQIZY5lILxig1G1ms0SOVMj1t76bwiCSSvuzFBeA%3D%3D&source=QR_CODE&merchantId=490307391&lang=en')}
        >
          <Image
            source={require('../../../assets/images/Snap_logo.jpg')}
            style={{resizeMode: 'contain', width: 100}}
          />
        </TouchableOpacity>
        { appointments?.length > 0 ? (
          <AppointmentReminder appointments={appointments} />
        ) : null}
      </View>
      <View style={{alignItems: 'center'}}>
        { urls ? (
          <View style={HomeStyles.imgContainer}>
            <Carousel
              ref={ref}
              data={urls}
              width={screenWidth * 0.95}
              height={225}
              autoPlay
              autoPlayInterval={5000}
              renderItem={({item}) => (
                <Image
                  source={{uri: item.url}}
                  style={{width: '100%', height: '100%'}}
                />
              )}
            />
          </View>
        ) : (
          <View style={[HomeStyles.imgContainer, {marginTop: 50}]}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
      </View>
    </Background>
  );
}

export default Index;