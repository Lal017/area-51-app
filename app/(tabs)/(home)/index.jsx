import Colors from "../../../constants/colors";
import Carousel from 'react-native-reanimated-carousel';
import { handleGetURLs } from "../../../components/adminComponents";
import { handleGetVehicles } from "../../../components/vehicleComponents";
import { handleGetMyAppointments } from "../../../components/appointmentComponents";
import { handleGetTowRequest } from '../../../components/towComponents';
import { AppointmentReminder, Background } from "../../../components/components";
import { HomeStyles, Styles } from "../../../constants/styles";
import { useApp } from "../../../components/context";
import { requestForegroundPermissionsAsync } from "expo-location";
import { Text, TouchableOpacity, Linking, View, Alert, Image, Dimensions, ActivityIndicator } from "react-native";
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { Easing , useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useEffect, useState, useRef } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;

// Home page after login
const Index = () =>
{
  const {
    client,
    userId,
    firstName,
    towRequest,
    vehicles,
    appointments,
    setTowRequest,
    setAppointments,
    setVehicles,
    vehiclePickup,
    customNotification,
    setCustomNotification,
    setVehiclePickup
  } = useApp();
  
  const [ urls, setUrls ] = useState();
  const [ refreshing, setRefreshing ] = useState(false);

  const ref = useRef();
  const shimmer = useSharedValue(-10);

  const onRefresh = async () =>
  {
    setRefreshing(true);

    try {
      // refresh appointments
      const getAppointments = await handleGetMyAppointments(client, userId);
      setAppointments(getAppointments);

      // get vehicleIds that have an appointment scheduled for pickup
      const scheduledVehiclePickups = getAppointments
        ?.filter(appt => appt.service === 'Vehicle Pickup')
        .map(appt => appt.vehicle?.id);

      // refresh vehicles
      const getVehicles = await handleGetVehicles(client, userId);
      setVehicles(getVehicles);

      // filter out vehicles that already have a scheduled pickup appointment
      const filterVehicles = getVehicles
        ?.some(item => item.readyForPickup === true && !scheduledVehiclePickups.includes(item.id));

      // set vehicles that are ready for pickup with no appointment
      setVehiclePickup(filterVehicles);

      // refresh tow requests
      const getTowRequest = await handleGetTowRequest(client, userId);
      setTowRequest(getTowRequest);

      // refresh home screen images
      const getUrls = await handleGetURLs();
      setUrls(getUrls);
    } catch (error) {
      console.error('ERROR, could not refresh:', error);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, [vehiclePickup]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmer.value * 100 }]
  }));

  useEffect(() => {
    const initUrls = async () =>
    {
      const getUrls = await handleGetURLs();
      setUrls(getUrls);

      // get vehicleIds that have an appointment scheduled for pickup
      const scheduledVehiclePickups = appointments
        ?.filter(appt => appt.service === 'Vehicle Pickup')
        .map(appt => appt.vehicle?.id);

      // filter out vehicles that already have a scheduled pickup appointment
      const filterVehicles = vehicles
        ?.some(item => item.readyForPickup === true && !scheduledVehiclePickups.includes(item.id));
      
      setVehiclePickup(filterVehicles);
    }

    initUrls();
  }, []);
  
  return (
    <Background refreshing={refreshing} onRefresh={onRefresh}>
      <View style={Styles.block}>
        <View style={{
          width: '100%', height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          columnGap: 10
        }}>
          <TouchableOpacity
            style={HomeStyles.shortcutButton}
            onPress={async () => {
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
          >
            <LinearGradient
              colors={[Colors.backgroundContrast, Colors.backgroundContrastShade, Colors.backgroundContrastShade]}
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
              start={{ x: 0, y: 0}}
              end={{ x: 0, y: 1}}
            />
            { towRequest && (
              <Animated.View
                style={[shimmerStyle, {
                  position: 'absolute',
                  top: 0, bottom: 0,
                  width: '100%'
                }]}
              >
                <LinearGradient
                  colors={['transparent', towRequest.status === 'REQUESTED' ? Colors.secondary : towRequest.status === 'IN_PROGRESS' ? Colors.primary : null, 'transparent']}
                  style={{flex: 1}}
                  start={{ x: 0, y: 0}}
                  end={{ x: 1, y: 0}}
                />
              </Animated.View>
            )}
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
            <LinearGradient
              colors={[Colors.backgroundContrast, Colors.backgroundContrastShade, Colors.backgroundContrastShade]}
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
              start={{ x: 0, y: 0}}
              end={{ x: 0, y: 1}}
            />
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
            <LinearGradient
              colors={[Colors.backgroundContrast, Colors.backgroundContrastShade, Colors.backgroundContrastShade]}
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
              start={{ x: 0, y: 0}}
              end={{ x: 0, y: 1}}
            />
            { vehiclePickup && (
              <Animated.View
                style={[shimmerStyle, {
                  position: 'absolute',
                  top: 0, bottom: 0,
                  width: '100%'
                }]}
              >
                <LinearGradient
                  colors={['transparent', Colors.tertiary, 'transparent']}
                  style={{flex: 1}}
                  start={{ x: 0, y: 0}}
                  end={{ x: 1, y: 0}}
                />
              </Animated.View>
            )}
            <Ionicons name='car-sport' size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
      }}>
      { vehiclePickup ? (
        <Text style={Styles.text}>Your vehicle is ready for pickup!</Text>
      ) : (
        <Text style={Styles.text}>Welcome {firstName}!</Text>
      )}
      </View>
      <View style={HomeStyles.panel}>
        <TouchableOpacity
          style={[HomeStyles.panelContainer, {backgroundColor: Colors.accent, minWidth: '40%'}]}
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
      { customNotification ? (
        <View style={HomeStyles.panel}>
          <View style={[HomeStyles.panelContainer, {backgroundColor: Colors.backgroundContrast, paddingTop: 25, paddingBottom: 25, position: 'relative'}]}>
            <TouchableOpacity
              style={{position: 'absolute', right: 10, top: 10}}
              onPress={() => setCustomNotification()}
            >
              <AntDesign name="closecircle" size={20} color={Colors.accent}/>
            </TouchableOpacity>
            <View style={Styles.infoContainer}>
              <Text style={HomeStyles.appointmentTitle}>{customNotification?.title}</Text>
              <Text style={HomeStyles.appointmentText}>{customNotification?.body}</Text>
            </View>
          </View>
        </View>
      ) : null }
    </Background>
  );
};

export default Index;