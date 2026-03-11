import Colors from '../../constants/colors';
import moment from 'moment';
import ProgressBar from 'react-native-progress/Bar';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Dimensions, KeyboardAvoidingView } from 'react-native';
import { handleGetAppointments, iconCheck, handleSetTimes, handleCreateAppointment, handleFinalCheck, handleUpdateAppointment } from '../../components/appointmentComponents';
import { useApp } from '../../components/context';
import { handleSendAdminNotif } from '../../components/notifComponents';
import { Select, CalendarHeader, formatDate, formatTime, Background, Loading, SimpleList, Tab } from '../../components/components';
import { ServiceStyles, Styles } from "../../constants/styles";
import { MaterialIcons, Ionicons, FontAwesome, FontAwesome6, AntDesign, FontAwesome5, Entypo, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

const screenWidth = Dimensions.get('window').width;

const Schedule = () =>
{
  const { client, vehicles, userId, setAppointments } = useApp();

  const { appointmentParam } = useLocalSearchParams();
  const appointment = appointmentParam ? JSON.parse(appointmentParam) : null;

  const [selectedDay, setSelectedDay] = useState(appointment?.date ?? undefined);
  const [selectedTime, setSelectedTime] = useState(appointment?.time ?? undefined);
  const [selectedService, setSelectedService] = useState(appointment?.service ?? undefined);
  const [selectedVehicle, setSelectedVehicle] = useState(appointment?.vehicle ?? (appointment?.vehicleYear ? {
    year: appointment.vehicleYear,
    make: appointment.vehicleMake,
    model: appointment.vehicleModel,
    color: appointment.vehicleColor,
    plate: appointment.vehiclePlate,
    vin: appointment.vehicleVin
    } : null)
  );
  const [scheduledAppointments, setScheduledAppointments] = useState();
  const [availableAppointments, setAvailableAppointments] = useState();
  const [notes, setNotes] = useState(appointment?.notes ?? undefined);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  // get available appointments
  useEffect(() => {
    const initializeAppointments = async () =>
    {
      let scheduled = await handleGetAppointments();

      // Filter out the appointment being edited
      if (appointment) {
        scheduled = scheduled.filter(
          (appt) => !(appt.date === appointment.date && appt.time === appointment.time)
        );

        const getDay = await handleSetTimes(scheduled, appointment.date);
        setAvailableAppointments(getDay);
      }

      setScheduledAppointments(scheduled);
      setIsReady(true);
    };

    initializeAppointments();
  }, []);

  // refresh to get new available appointments
  const onRefresh = async () =>
  {
    setRefreshing(true);

    try {
      // refresh appointments
      const getAppointments = await handleGetAppointments();
      setScheduledAppointments(getAppointments);

    } catch (error) {
      console.error('ERROR, could not refresh:', error);
    }

    setRefreshing(false);
  };

  // called when a user clicks on a new day on the calendar
  const handleDayPress = async (day) =>
  {
    setErrorMessage(undefined);
    setSelectedDay(day.dateString);
    setSelectedTime(undefined);
    const getDay = await handleSetTimes(scheduledAppointments, day.dateString);
    setAvailableAppointments(getDay);
  };

  const DISABLED_DAYS = ['Saturday', 'Sunday'];

  // used to disable certain days of the month
  const getDaysInMonth = (month, year, days) => {
    let pivot = moment().month(month).year(year).startOf('month');
    const end = moment().month(month).year(year).endOf('month');

    let dates = {}
    const disabled = { disabled: true }
    while(pivot.isBefore(end)) {
      days.forEach((day) => {
        dates[pivot.day(day).format("YYYY-MM-DD")] = disabled
      })
      pivot.add(7, 'days')
    }

    return dates;
  }

  const today = moment();
  const [markedDates, setMarkedDates] = useState(
    getDaysInMonth(today.month(), today.year(), DISABLED_DAYS)
  );

  const handleMonthChange = (date) => setMarkedDates(getDaysInMonth(date.month - 1, date.year, DISABLED_DAYS));

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['25%', '60%', '80%'], []);
  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.snapToIndex(2);

  return (
    <GestureHandlerRootView>
    { isReady ? (
      <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
        <Background refreshing={refreshing} onRefresh={onRefresh}>
          <View style={ServiceStyles.progressBar}>
            <AntDesign name='calendar' size={35} color={step >= 1 ? Colors.secondary : Colors.backDropAccent} />
            <ProgressBar
              width={screenWidth * 0.15}
              unfilledColor='white'
              borderWidth={0}
              color={Colors.secondary}
              progress={step === 1 ? 0 : 1}
            />
            <Ionicons name="car-sport" size={30} color={step >= 2 ? Colors.secondary : Colors.backDropAccent}/>
            <ProgressBar
              width={screenWidth * 0.15}
              unfilledColor='white'
              borderWidth={0}
              color={Colors.secondary}
              progress={step <= 2 ? 0 : 1}
            />
            <FontAwesome5 name="wrench" size={30} color={step >= 3 ? Colors.secondary : Colors.backDropAccent}/>
            <ProgressBar
              width={screenWidth * 0.15}
              unfilledColor='white'
              borderWidth={0}
              color={Colors.secondary}
              progress={step <= 3 ? 0 : 1}
            />
            <Entypo name="clipboard" size={30} color={step >= 4 ? Colors.secondary : Colors.backDropAccent}/>
          </View>
          { step === 1 ? (
            <>
              <View style={Styles.infoContainer}>
                <Text style={Styles.headerTitle}>Date Selection</Text>
                <Text style={Styles.tabHeader}>Select a day and time to get started</Text>
              </View>
              <View style={Styles.block}>
                <Calendar
                  onMonthChange={handleMonthChange}
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  theme={{
                    todayTextColor: Colors.secondary,
                    textDayFontSize: RFValue(15),
                    calendarBackground: 'transparent',
                    dayTextColor: Colors.secondary,
                    textDisabledColor: 'grey'
                  }}
                  minDate={new Date().toDateString()}
                  onDayPress={day => handleDayPress(day)}
                  enableSwipeMonths={true}
                  markedDates={{
                    ...markedDates, // from getDaysInMonth, disabling weekends
                    ...(selectedDay && {
                      [selectedDay]: {
                        selected: true,
                        selectedColor: Colors.tertiary,
                        // Preserve disabled state if it's also a disabled date
                        ...(markedDates[selectedDay] || {})
                      }
                    })
                  }}
                  renderArrow={direction => <Entypo name={direction === 'left' ? 'chevron-with-circle-left' : 'chevron-with-circle-right'} size={25} color={Colors.backDropAccent}/>}
                  hideExtraDays={true}
                  disableAllTouchEventsForDisabledDays={true}
                  renderHeader={date => <CalendarHeader date={date} />}
                />
              </View>
              <View style={Styles.block}>
                <TouchableOpacity
                  style={[ServiceStyles.timeSelectContainer, {width: '90%', justifyContent: 'center', alignSelf: 'center'}]}
                  onPress={() => {
                    setErrorMessage(undefined);
                    if (selectedDay) handleOpenPress();
                    else setErrorMessage('Please select a day first');
                  }}
                >
                  <LinearGradient
                    colors={[Colors.button, Colors.backgroundAccent]}
                    style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}
                    start={{ x: 0, y: 0}}
                    end={{ x: 1, y: 1}}
                  />
                  <FontAwesome6 name='caret-down' size={25} style={[Styles.rightIcon, {color: Colors.contrast}]}/>
                  <Text style={Styles.tabText}>{selectedTime ? formatTime(selectedTime) : 'Select a time'}</Text>
                </TouchableOpacity>
              </View>
              { errorMessage && (
                <View style={Styles.block}>
                  <View style={Styles.errorContainer}>
                    <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                    <Text style={Styles.errorText}>{errorMessage}</Text>
                  </View>
                </View>
              )}
              <View style={ServiceStyles.buttonContainer}>
                <TouchableOpacity
                  style={[ServiceStyles.directionButton, {opacity: 1}]}
                  disabled={true}
                >
                  <AntDesign name='left' size={25} color='white'/>
                  <Text style={Styles.actionText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ServiceStyles.directionButton}
                  onPress={() => {
                    if (selectedDay && selectedTime) {
                      setStep(2);
                      setErrorMessage(undefined);
                    } else if (!selectedDay) setErrorMessage('Select a date and time to continue');
                    else setErrorMessage('Select a time to continue');
                  }}
                >
                  <Text style={Styles.actionText}>Continue</Text>
                  <AntDesign name='right' size={25} color='white'/>
                </TouchableOpacity>
              </View>
              <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                backgroundStyle={{ backgroundColor: Colors.contrast}}
              >
                <BottomSheetView>
                  <View style={Styles.block}>
                    <View style={ServiceStyles.timeContainer}>
                      {availableAppointments?.map((time, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => setSelectedTime(time)}
                          style={[
                            ServiceStyles.timeBubble,
                            selectedTime === time && {
                              backgroundColor: Colors.secondary
                            }
                          ]}
                        >
                          <Text style={[Styles.text, { textAlign: 'center' }]}
                          >{formatTime(time)}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        style={[Styles.actionButton, {backgroundColor: Colors.button}]}
                        onPress={handleClosePress}
                      >
                        <Text style={Styles.actionText}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </BottomSheetView>
              </BottomSheet>
            </>
          ) : step === 2 ? (
            <>
              <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                  <Text style={Styles.headerTitle}>Vehicle Selection</Text>
                  <Text style={Styles.tabHeader}>Select the vehicle for the appointment</Text>
                </View>
              </View>
              <View style={[Styles.block, {rowGap: 0}]}>
                <SimpleList
                  data={vehicles}
                  renderItem={({item}) =>
                    <Select
                      header={`${item.year}`}
                      text={`${item.make} ${item.model}`}
                      selected={item.id === selectedVehicle?.id ? true : false}
                      action={() => {item.id === selectedVehicle?.id ? setSelectedVehicle(undefined) : setSelectedVehicle(item)}}
                      rightIcon={<Ionicons name="car-sport" size={30} style={Styles.rightIcon} color={Colors.backDropAccent}/>}
                      leftIcon={<FontAwesome name={selectedVehicle?.id === item.id ? "circle" : "circle-o"} size={25} style={Styles.icon} color={Colors.backDropAccent}/>}
                    />
                  }
                />
              </View>
              { errorMessage && (
                <View style={Styles.block}>
                  <View style={Styles.errorContainer}>
                    <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                    <Text style={Styles.errorText}>{errorMessage}</Text>
                  </View>
                </View>
              )}
              <View style={ServiceStyles.buttonContainer}>
                <TouchableOpacity
                  style={ServiceStyles.directionButton}
                  onPress={() => {
                    setStep(1);
                    setErrorMessage(undefined);
                  }}
                >
                  <AntDesign name='left' size={25} color='white' />
                  <Text style={Styles.actionText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ServiceStyles.directionButton}
                  onPress={() => {
                    if (selectedVehicle) {
                      setStep(3);
                      setErrorMessage(undefined);
                    } else {
                      setErrorMessage('Select a vehicle to continue');
                    }
                  }}
                >
                  <Text style={Styles.actionText}>Continue</Text>
                  <AntDesign name='right' size={25} color='white' />
                </TouchableOpacity>
              </View>
            </>
          ) : step === 3 ? (
            <>
              <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                  <Text style={Styles.headerTitle}>Service Selection</Text>
                  <Text style={Styles.tabHeader}>Select the service needed for the appointment</Text>
                </View>
              </View>
              <View style={[Styles.block, {rowGap: 0}]}>
                <Select
                  text="Oil Change"
                  selected={selectedService === 'Oil Change' ? true : false}
                  action={() => {selectedService === 'Oil Change' ? setSelectedService(undefined) : setSelectedService('Oil Change')}}
                  rightIcon={<FontAwesome5 name="oil-can" size={30} style={Styles.rightIcon} color={Colors.backDrop} />}
                  leftIcon={<FontAwesome name={selectedService === 'Oil Change' ? "circle" : "circle-o"} size={25} style={Styles.icon} color={selectedService === 'Oil Change' ? Colors.backDrop : null}/>}
                />
                <Select
                  text="Diagnosis"
                  selected={selectedService === 'Diagnosis' ? true : false}
                  action={() => {selectedService === 'Diagnosis' ? setSelectedService(undefined) : setSelectedService('Diagnosis')}}
                  rightIcon={<FontAwesome name="stethoscope" size={30} style={Styles.rightIcon} color={Colors.backDrop}/>}
                  leftIcon={<FontAwesome name={selectedService === 'Diagnosis' ? "circle" : "circle-o"} size={25} style={Styles.icon} color={selectedService === 'Diagnosis' ? Colors.backDrop : null}/>}
                />
                <Select
                  text="Tuning"
                  selected={selectedService === 'Tuning' ? true : false}
                  action={() => {selectedService === 'Tuning' ? setSelectedService(undefined) : setSelectedService('Tuning')}}
                  rightIcon={<Entypo name="area-graph" size={30} style={Styles.rightIcon} color={Colors.backDrop}/>}
                  leftIcon={<FontAwesome name={selectedService === 'Tuning' ? "circle" : "circle-o"} size={25} style={Styles.icon} color={selectedService === 'Tuning' ? Colors.backDrop : null}/>}
                />
                <Select
                  text="A/C"
                  selected={selectedService === 'A/C' ? true : false}
                  action={() => {selectedService === 'A/C' ? setSelectedService(undefined) : setSelectedService('A/C')}}
                  rightIcon={<MaterialIcons name="air" size={30} style={Styles.rightIcon} color={Colors.backDrop}/>}
                  leftIcon={<FontAwesome name={selectedService === 'A/C' ? "circle" : "circle-o"} size={25} style={Styles.icon} color={selectedService === 'A/C' ? Colors.backDrop : null}/>}
                />
                <Select
                  text="Other"
                  selected={selectedService === 'Other' ? true : false}
                  action={() => {selectedService === 'Other' ? setSelectedService(undefined) : setSelectedService('Other')}}
                  rightIcon={<MaterialCommunityIcons name="dots-horizontal-circle" size={30} style={Styles.rightIcon} color={Colors.backDrop} />}
                  leftIcon={<FontAwesome name={selectedService === 'Other' ? "circle" : "circle-o"} size={25} style={Styles.icon} color={selectedService === 'Other' ? Colors.backDrop : null}/>}
                />
              </View>
              { errorMessage && (
                <View style={Styles.block}>
                  <View style={Styles.errorContainer}>
                    <FontAwesome name='exclamation-circle' size={20} style={[Styles.icon, {color: 'red'}]}/>
                    <Text style={Styles.errorText}>{errorMessage}</Text>
                  </View>
                </View>
              )}
              <View style={[Styles.floatingBlock, {rowGap: 25}]}>
                  <View style={Styles.infoContainer}>
                      <Text style={Styles.headerTitle}>Description <Text style={Styles.text}>(optional)</Text></Text>
                      <Text style={Styles.tabHeader}>Please, describe any problems with the vehicle</Text>
                  </View>
                  <View style={Styles.inputWrapper}>
                      <MaterialIcons name="notes" size={30} style={Styles.iconAlt} />
                      <TextInput
                          placeholder="e.g. Flat tire, dead battery, etc."
                          placeholderTextColor={Colors.subText}
                          style={Styles.inputAlt}
                          multiline={true}
                          value={notes}
                          onChangeText={setNotes}
                      />
                  </View>
              </View>
              <View style={[Styles.block, {paddingTop: 20}]}>
                <View style={ServiceStyles.buttonContainer}>
                  <TouchableOpacity
                    style={ServiceStyles.directionButton}
                    onPress={() => {
                      setStep(2);
                      setErrorMessage(undefined);
                    }}
                  >
                    <AntDesign name='left' size={25} color='white' />
                    <Text style={Styles.actionText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={ServiceStyles.directionButton}
                    onPress={() => {
                      if (selectedService) {
                        setStep(4);
                        setErrorMessage(undefined);
                      } else {
                        setErrorMessage('Select a service to continue');
                      }
                    }}
                  >
                    <Text style={Styles.actionText}>Continue</Text>
                    <AntDesign name='right' size={25} color='white' />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : step === 4 ? (
            <>
            <View style={[Styles.block, {rowGap: 10}]}>
              <View style={Styles.infoContainer}>
                <Text style={Styles.headerTitle}>Appointment Information</Text>
                <Text style={Styles.tabHeader}>Review the information and confirm it is correct</Text>
              </View>
            </View>
            <View style={Styles.block}>
              <View style={Styles.infoContainer}>
                <Tab
                  header='Date'
                  text={formatDate(selectedDay)}
                  leftIcon={<AntDesign name='calendar' size={30} style={Styles.icon}/>}
                />
                <Tab
                  header='Time'
                  text={formatTime(selectedTime)}
                  leftIcon={<MaterialCommunityIcons name='clock' size={30} style={Styles.icon}/>}
                />
                <Tab
                  header='Service'
                  text={`${selectedService}`}
                  leftIcon={iconCheck(selectedService)}
                />
              </View>
              { notes ? (
                <View style={Styles.infoContainer}>
                  <Text style={Styles.headerTitle}>Customer Note</Text>
                  <Text style={Styles.text}>{notes}</Text>
                </View>
              ) : null }
            </View>
            <View style={Styles.floatingBlock}>
              <View style={Styles.infoContainer}>
                <Text style={Styles.headerTitle}>Vehicle</Text>
              </View>
              <Tab
                  header={`${selectedVehicle.year}`}
                  text={`${selectedVehicle.make} ${selectedVehicle.model}`}
                  leftIcon={<Ionicons name='car-sport' size={30} style={Styles.icon}/>}
                  style={{height: 'none'}}
              />
              <Tab
                  header='Vehicle Color'
                  text={`${selectedVehicle.color}`}
                  leftIcon={<FontAwesome name='paint-brush' size={30} style={Styles.icon}/>}
                  style={{height: 'none'}}
              />
              { selectedVehicle.plate && (
                  <Tab
                      header='License Plate #'
                      text={`${selectedVehicle.plate}`}
                      leftIcon={<FontAwesome name='id-card' size={30} style={Styles.icon}/>}
                      style={{height: 'none'}}
                  />
              )}
              { selectedVehicle.vin && (
                  <Tab
                      header='VIN'
                      text={`${selectedVehicle.vin}`}
                      leftIcon={<FontAwesome name='barcode' size={30} style={Styles.icon}/>}
                      style={{height: 'none'}}
                  />
              )}
            </View>
            <View style={[Styles.block, {paddingTop: 20}]}>
              <View style={ServiceStyles.buttonContainer}>
                <TouchableOpacity
                  style={ServiceStyles.directionButton}
                  onPress={() => setStep(3)}
                >
                  <AntDesign name='left' size={25} color='white'/>
                  <Text style={Styles.actionText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    if (loading) return;
                    setLoading(true);
                    const isTaken = await handleFinalCheck(selectedDay, selectedTime);
                    if (!isTaken) {
                      if (appointment) {
                        await handleSendAdminNotif('Appointment Edited', 'A customer has edited their appointment');
                        await handleUpdateAppointment(client, appointment.id, selectedDay, selectedTime, selectedService, notes, userId, selectedVehicle, setAppointments);
                      } else {
                        await handleSendAdminNotif('Appointment Scheduled', 'A customer has scheduled an appointment');
                        await handleCreateAppointment({client, date: selectedDay, time: selectedTime, service: selectedService, notes, userId, vehicle: selectedVehicle, setAppointments});
                      }
                        router.replace('(tabs)');
                    } else {
                      Alert.alert(
                        'Time slot invalid',
                        `A customer was just scheduled for ${formatDate(selectedDay)} at ${formatTime(selectedTime)}. Please choose a different time slot`,
                        [{
                          text: 'OK',
                          onPress: async () => {
                            // refresh appointments
                            const getAppointments = await handleGetAppointments(client, userId);
                            setScheduledAppointments(getAppointments);
                            setStep(1)
                          }
                        }]
                      )
                    }
                    setLoading(false);
                  }}
                  style={[ServiceStyles.directionButton, loading && { opacity: 0.5 }, {backgroundColor: Colors.primary}]}
                  disabled={loading}
                >
                  <Text style={Styles.actionText}>{appointment ? 'Update' : 'Schedule'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            </>
          ) : null }
        </Background>
      </KeyboardAvoidingView>
    ) : (
      <Loading/>
    )}
    </GestureHandlerRootView>
  )
};

export default Schedule;