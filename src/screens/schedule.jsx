import Colors from '../../constants/colors';
import moment from 'moment';
import { handleGetAppointments, handleSetTimes, handleCreateAppointment, handleFinalCheck, handleUpdateAppointment } from '../../components/appointmentComponents';
import { useApp } from '../../components/context';
import { handleSendAdminNotif } from '../../components/notifComponents';
import { Select, CalendarHeader, formatDate, formatTime, Background, Loading } from '../../components/components';
import { ServiceStyles, Styles } from "../../constants/styles";
import { MaterialIcons, Ionicons, FontAwesome, AntDesign, FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

const Schedule = () =>
{
  const { client, vehicles, userId, setAppointments } = useApp();
  const navigate = useNavigation();
  const { appointmentParam } = useLocalSearchParams();
  const appointment = appointmentParam ? JSON.parse(appointmentParam) : null;

  const [selectedDay, setSelectedDay] = useState(appointment?.date ?? undefined);
  const [selectedTime, setSelectedTime] = useState(appointment?.time ?? undefined);
  const [selectedService, setSelectedService] = useState(appointment?.service ?? undefined);
  const [selectedVehicle, setSelectedVehicle] = useState(appointment?.vehicle ?? undefined);
  const [scheduledAppointments, setScheduledAppointments] = useState();
  const [availableAppointments, setAvailableAppointments] = useState();
  const [notes, setNotes] = useState(appointment?.notes ?? undefined);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
    setSelectedDay(day.dateString);
    setSelectedTime(undefined);
    const getDay = await handleSetTimes(scheduledAppointments, day.dateString);
    setAvailableAppointments(getDay);
  };

  const DISABLED_DAYS = ['Saturday', 'Sunday']

  // used to disable certain days of the month
  const getDaysInMonth = (month, year, days) => {
    let pivot = moment().month(month).year(year).startOf('month')
    const end = moment().month(month).year(year).endOf('month')

    let dates = {}
    const disabled = { disabled: true }
    while(pivot.isBefore(end)) {
      days.forEach((day) => {
        dates[pivot.day(day).format("YYYY-MM-DD")] = disabled
      })
      pivot.add(7, 'days')
    }

    return dates
  }

  const today = moment();
  const [markedDates, setMarkedDates] = useState(
    getDaysInMonth(today.month(), today.year(), DISABLED_DAYS)
  );

  const handleMonthChange = (date) => {
    setMarkedDates(getDaysInMonth(date.month - 1, date.year, DISABLED_DAYS));
  };

  return (
    <>
    { isReady ? (
      <Background refreshing={refreshing} onRefresh={onRefresh}>
        <View style={ServiceStyles.progressBar}>
          <AntDesign name='calendar' size={35} color={step > 1 ? Colors.secondary : Colors.backDropAccent} />
          <View style={[ServiceStyles.progressBarLine, {backgroundColor: step > 1 ? Colors.secondary : Colors.backDropAccent}]} />
          <Ionicons name="car-sport" size={30} color={step > 2 ? Colors.secondary : Colors.backDropAccent}/>
          <View style={[ServiceStyles.progressBarLine, {backgroundColor: step > 2 ? Colors.secondary : Colors.backDropAccent}]} />
          <FontAwesome5 name="wrench" size={30} color={step > 3 ? Colors.secondary : Colors.backDropAccent}/>
          <View style={[ServiceStyles.progressBarLine, {backgroundColor: step > 3 ? Colors.secondary : Colors.backDropAccent}]} />
          <Entypo name="clipboard" size={30} color={step > 4 ? Colors.secondary : Colors.backDropAccent}/>
        </View>
        { step === 1 ? (
          <>
            <View style={Styles.infoContainer}>
              <Text style={Styles.subTitle}>Date Selection</Text>
              <Text style={Styles.text}>Select a day and time to get started</Text>
            </View>
            <View style={Styles.block}>
              <Calendar
                onMonthChange={handleMonthChange}
                style={{
                  backgroundColor: 'transparent',
                }}
                theme={{
                  todayTextColor: Colors.secondary,
                  textDayFontSize: 18,
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
                renderArrow={direction => <AntDesign name={direction === 'left' ? 'arrowleft' : 'arrowright'} size={24} color={Colors.backDropAccent}/>}
                hideExtraDays={true}
                disableAllTouchEventsForDisabledDays={true}
                renderHeader={date => <CalendarHeader date={date} />}
              />
            </View>
            <ScrollView
              contentContainerStyle={ServiceStyles.timeContainer}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
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
            </ScrollView>
            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25, width: '100%'}}>
              <View style={ServiceStyles.buttonContainer}>
                <TouchableOpacity
                  style={[ServiceStyles.directionButton, {opacity: 0}]}
                  disabled={true}
                >
                  <FontAwesome name='arrow-left' size={24} color='white' />
                  <Text style={Styles.actionText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ServiceStyles.directionButton}
                  onPress={() => {
                    if (selectedDay && selectedTime) {
                      setStep(2);
                    }
                  }}
                >
                  <Text style={Styles.actionText}>Continue</Text>
                  <FontAwesome name='arrow-right' size={24} color='white' />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : step === 2 ? (
          <>
            <View style={Styles.block}>
              <View style={Styles.infoContainer}>
                <Text style={Styles.subTitle}>Select a Vehicle</Text>
              </View>
              <View style={ServiceStyles.selectionContainer}>
                {vehicles?.map((vehicle, index) => (
                  <Select
                    key={index}
                    text={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    selected={vehicle?.id === selectedVehicle?.id ? true : false}
                    action={() => setSelectedVehicle(vehicle)}
                    leftIcon={<Ionicons name="car-sport" size={30} style={Styles.icon} color={Colors.backDrop}/>}
                    rightIcon={<FontAwesome name={selectedVehicle?.id === vehicle?.id ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedVehicle === vehicle ? Colors.backDrop : null}/>}
                  />
                ))}
              </View>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25, width: '100%'}}>
              <View style={ServiceStyles.buttonContainer}>
                <TouchableOpacity
                  style={ServiceStyles.directionButton}
                  onPress={() => setStep(1)}
                >
                  <FontAwesome name='arrow-left' size={24} color='white' />
                  <Text style={Styles.actionText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ServiceStyles.directionButton}
                  onPress={() => {
                    if (selectedVehicle) {
                      setStep(3);
                    }
                  }}
                >
                  <Text style={Styles.actionText}>Continue</Text>
                  <FontAwesome name='arrow-right' size={24} color='white' />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : step === 3 ? (
          <>
            <View style={Styles.block}>
              <View style={Styles.infoContainer}>
                <Text style={Styles.subTitle}>Select a service</Text>
              </View>
              <View style={ServiceStyles.selectionContainer}>
                <Select
                  text="Oil Change"
                  selected={selectedService === 'Oil Change' ? true : false}
                  action={() => setSelectedService('Oil Change')}
                  leftIcon={<FontAwesome5 name="oil-can" size={30} style={Styles.icon} color={Colors.backDrop} />}
                  rightIcon={<FontAwesome name={selectedService === 'Oil Change' ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedService === 'Oil Change' ? Colors.backDrop : null}/>}
                />
                <Select
                  text="Diagnosis"
                  selected={selectedService === 'Diagnosis' ? true : false}
                  action={() => setSelectedService('Diagnosis')}
                  leftIcon={<FontAwesome name="stethoscope" size={30} style={Styles.icon} color={Colors.backDrop}/>}
                  rightIcon={<FontAwesome name={selectedService === 'Diagnosis' ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedService === 'Diagnosis' ? Colors.backDrop : null}/>}
                />
                <Select
                  text="Tuning"
                  selected={selectedService === 'Tuning' ? true : false}
                  action={() => setSelectedService('Tuning')}
                  leftIcon={<Entypo name="area-graph" size={30} style={Styles.icon} color={Colors.backDrop}/>}
                  rightIcon={<FontAwesome name={selectedService === 'Tuning' ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedService === 'Tuning' ? Colors.backDrop : null}/>}
                />
                <Select
                  text="A/C"
                  selected={selectedService === 'A/C' ? true : false}
                  action={() => setSelectedService('A/C')}
                  leftIcon={<MaterialIcons name="air" size={30} style={Styles.icon} color={Colors.backDrop}/>}
                  rightIcon={<FontAwesome name={selectedService === 'A/C' ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedService === 'A/C' ? Colors.backDrop : null}/>}
                />
                <Select
                  text="Other"
                  selected={selectedService === 'Other' ? true : false}
                  action={() => setSelectedService('Other')}
                  leftIcon={<MaterialCommunityIcons name="dots-horizontal-circle" size={30} style={Styles.icon} color={Colors.backDrop} />}
                  rightIcon={<FontAwesome name={selectedService === 'Other' ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedService === 'Other' ? Colors.backDrop : null}/>}
                />
              </View>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25, width: '100%'}}>
              <View style={ServiceStyles.buttonContainer}>
                <TouchableOpacity
                  style={ServiceStyles.directionButton}
                  onPress={() => setStep(2)}
                >
                  <FontAwesome name='arrow-left' size={24} color='white' />
                  <Text style={Styles.actionText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ServiceStyles.directionButton}
                  onPress={() => {
                    if (selectedService) setStep(4);
                  }}
                >
                  <Text style={Styles.actionText}>Continue</Text>
                  <FontAwesome name='arrow-right' size={24} color='white' />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : step === 4 ? (
          <>
            <View style={{width: '100%', flex: 1, justifyContent: 'center'}}>
              <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                  <Text style={Styles.subTitle}>Description (optional)</Text>
                  <Text style={Styles.text}>Please, describe any problems with the vehicle worth mentioning</Text>
                </View>
                <View style={Styles.inputWrapper}>
                  <MaterialIcons name='notes' size={30} style={Styles.iconAlt} />
                  <TextInput
                    placeholder='description'
                    placeholderTextColor={Colors.text}
                    value={notes}
                    onChangeText={setNotes}
                    style={Styles.inputAlt}
                  />
                </View>
              </View>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25, width: '100%'}}>
              <View style={ServiceStyles.buttonContainer}>
                <TouchableOpacity
                  style={ServiceStyles.directionButton}
                  onPress={() => setStep(3)}
                >
                  <FontAwesome name='arrow-left' size={24} color='white' />
                  <Text style={Styles.actionText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setStep(5)}
                  style={ServiceStyles.directionButton}
                >
                  <Text style={Styles.actionText}>Continue</Text>
                  <FontAwesome name='arrow-right' size={24} color='white' />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : step === 5 ? (
          <>
          <View style={{width: '100%', flex: 1, justifyContent: 'center'}}>
            <View style={Styles.infoContainer}>
              <Text style={Styles.subTitle}>Date</Text>
              <Text style={Styles.text}>{formatDate(selectedDay)}</Text>
              <Text style={Styles.subTitle}>Time</Text>
              <Text style={Styles.text}>{formatTime(selectedTime)}</Text>
              <Text style={Styles.subTitle}>Vehicle</Text>
              <Text style={Styles.text}>{`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}</Text>
              <Text style={Styles.subTitle}>Service</Text>
              <Text style={Styles.text}>{selectedService}</Text>
              <Text style={Styles.subTitle}>Notes</Text>
              <Text style={Styles.text}>{notes}</Text>
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25, width: '100%'}}>
            <View style={ServiceStyles.buttonContainer}>
              <TouchableOpacity
                style={ServiceStyles.directionButton}
                onPress={() => setStep(4)}
              >
                <FontAwesome name='arrow-left' size={24} color='white'/>
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
                      await handleUpdateAppointment(client, appointment.id, selectedDay, selectedTime, selectedService, notes, userId, selectedVehicle.id, setAppointments);
                    } else {
                      await handleSendAdminNotif('Appointment Scheduled', 'A customer has scheduled an appointment');
                      await handleCreateAppointment(client, selectedDay, selectedTime, selectedService, notes, userId, selectedVehicle.id, setAppointments);
                    }
                      navigate.reset({
                      index: 0,
                      routes: [{ name: '(tabs)'}]
                    });
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
    ) : (
      <Loading/>
    )}
    </>
  )
};

export default Schedule;