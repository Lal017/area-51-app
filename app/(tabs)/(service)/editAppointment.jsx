import { useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { ServiceStyles, Styles } from "../../../constants/styles";
import { Calendar } from "react-native-calendars";
import { handleGetAppointments, handleSetTimes, handleUpdateAppointment } from '../../../components/scheduleComponents';
import Colors from '../../../constants/colors';
import { Select, CalendarHeader, formatDate, formatTime } from '../../../components/components';
import { MaterialIcons, Ionicons, FontAwesome, AntDesign, FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../../components/context';
import { handleSendAdminNotif } from '../../../components/notifComponents';

const Schedule = () =>
{
  const { client, vehicles, userId } = useApp();
  const { appointmentParam } = useLocalSearchParams();
  const appointment = JSON.parse(appointmentParam);

  const [selectedDay, setSelectedDay] = useState(appointment.date);
  const [selectedTime, setSelectedTime] = useState(appointment.time);
  const [selectedService, setSelectedService] = useState(appointment.service);
  const [selectedVehicle, setSelectedVehicle] = useState(appointment.vehicle);
  const [scheduledAppointments, setScheduledAppointments] = useState();
  const [availableAppointments, setAvailableAppointments] = useState();
  const [notes, setNotes] = useState(appointment.notes);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const initializeAppointments = async () =>
    {
      const scheduled = await handleGetAppointments();
      // Filter out the appointment being edited
      console.log('appointment', appointment.date, appointment.time);
      const updatedScheduled = scheduled.filter(
        (appt) => !(appt.date === appointment.date && appt.time === appointment.time)
      );
      setScheduledAppointments(updatedScheduled);
    };

    initializeAppointments();
  }, []);

  const handleDayPress = async (day) =>
  {
    setSelectedDay(day.dateString);
    setSelectedTime(undefined);
    const getDay = await handleSetTimes(scheduledAppointments, day.dateString);
    setAvailableAppointments(getDay);
  };

  return (
    <>
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
        <ScrollView contentContainerStyle={Styles.scrollPage}>
          <View style={ServiceStyles.calendarContainer}>
            <Text style={[Styles.subTitle, {alignSelf: 'center'}]}>Date Selection</Text>
            <Calendar
              style={{
                height: 325,
                backgroundColor: Colors.background
              }}
              theme={{
                todayTextColor: Colors.secondary,
                textDayFontSize: 18,
                calendarBackground: Colors.background,
                dayTextColor: Colors.secondary,
                textDisabledColor: 'grey'
              }}
              minDate={new Date().toDateString()}
              onDayPress={day => handleDayPress(day)}
              enableSwipeMonths={true}
              markedDates={{
                [selectedDay]: {
                  selected: true,
                  selectedColor: Colors.tertiary,
                }
              }}
              renderArrow={direction => <AntDesign name={direction === 'left' ? 'arrowleft' : 'arrowright'} size={24} color={Colors.backDropAccent}/>}
              hideExtraDays={true}
              disableAllTouchEventsForDisabledDays={true}
              renderHeader={date => <CalendarHeader date={date} />}
            />
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
                  <Text style={[
                    Styles.subTitle, { color: 'black' }, selectedTime === time && { color: 'white' }, {textAlign: 'center'}
                  ]}
                  >{formatTime(time)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[ServiceStyles.buttonContainer, {marginBottom: 25}]}>
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
        </ScrollView>
      ) : step === 2 ? (
        <View style={[Styles.page, {justifyContent: 'center', rowGap: 20}]}>
          <Text style={Styles.subTitle}>Select a Vehicle</Text>
          <View style={ServiceStyles.selectionContainer}>
            {vehicles?.map((vehicle, index) => (
              <Select
                key={index}
                text={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                selected={vehicle.id === selectedVehicle.id ? true : false}
                action={() => setSelectedVehicle(vehicle)}
                leftIcon={<Ionicons name="car-sport" size={30} style={Styles.icon} color={selectedVehicle === vehicle ? Colors.backDrop : null}/>}
                rightIcon={<FontAwesome name={selectedVehicle.id === vehicle.id ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedVehicle === vehicle ? Colors.backDrop : null}/>}
              />
            ))}
          </View>
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
      ) : step === 3 ? (
        <View style={[Styles.page, {justifyContent: 'center', rowGap: 20}]}>
          <Text style={Styles.subTitle}>Select a service</Text>
          <View style={ServiceStyles.selectionContainer}>
            <Select
              text="Oil Change"
              selected={selectedService === 'Oil Change' ? true : false}
              action={() => setSelectedService('Oil Change')}
              leftIcon={<FontAwesome5 name="oil-can" size={30} style={Styles.icon} color={selectedService === 'Oil Change' ? Colors.backDrop : null} />}
              rightIcon={<FontAwesome name={selectedService === 'Oil Change' ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedService === 'Oil Change' ? Colors.backDrop : null}/>}
            />
            <Select
              text="Diagnosis"
              selected={selectedService === 'Diagnosis' ? true : false}
              action={() => setSelectedService('Diagnosis')}
              leftIcon={<FontAwesome name="stethoscope" size={30} style={Styles.icon} color={selectedService === 'Diagnosis' ? Colors.backDrop : null}/>}
              rightIcon={<FontAwesome name={selectedService === 'Diagnosis' ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedService === 'Diagnosis' ? Colors.backDrop : null}/>}
            />
            <Select
              text="Tuning"
              selected={selectedService === 'Tuning' ? true : false}
              action={() => setSelectedService('Tuning')}
              leftIcon={<Entypo name="area-graph" size={30} style={Styles.icon} color={selectedService === 'Tuning' ? Colors.backDrop : null}/>}
              rightIcon={<FontAwesome name={selectedService === 'Tuning' ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedService === 'Tuning' ? Colors.backDrop : null}/>}
            />
            <Select
              text="A/C"
              selected={selectedService === 'A/C' ? true : false}
              action={() => setSelectedService('A/C')}
              leftIcon={<MaterialIcons name="air" size={30} style={Styles.icon} color={selectedService === 'A/C' ? Colors.backDrop : null}/>}
              rightIcon={<FontAwesome name={selectedService === 'A/C' ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedService === 'A/C' ? Colors.backDrop : null}/>}
            />
            <Select
              text="Other"
              selected={selectedService === 'Other' ? true : false}
              action={() => setSelectedService('Other')}
              leftIcon={<MaterialCommunityIcons name="dots-horizontal-circle" size={30} style={Styles.icon} color={selectedService === 'Other' ? Colors.backDrop : null} />}
              rightIcon={<FontAwesome name={selectedService === 'Other' ? "circle" : "circle-o"} size={25} style={Styles.rightIcon} color={selectedService === 'Other' ? Colors.backDrop : null}/>}
            />
          </View>
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
      ) : step === 4 ? (
        <KeyboardAvoidingView behavior='padding' style={[Styles.page, {justifyContent: 'center'}]}>
          <View style={Styles.inputContainer}>
            <Text style={[Styles.subTitle, {textAlign: 'center', paddingLeft: 30, paddingRight: 30}]}>Please provide any notes about the vehicle worth mentioning.</Text>
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
        </KeyboardAvoidingView>
      ) : step === 5 ? (
        <View style={[Styles.page, {justifyContent: 'center'}]}>
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
          <View style={ServiceStyles.buttonContainer}>
            <TouchableOpacity
              style={ServiceStyles.directionButton}
              onPress={() => setStep(4)}
            >
              <FontAwesome name='arrow-left' size={24} color='white'/>
              <Text style={Styles.actionText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleSendAdminNotif('Appointment Edited', 'A customer has edited an appointment');
                handleUpdateAppointment(client, appointment.id, selectedDay, selectedTime, selectedService, notes, userId, selectedVehicle.id);
                router.replace('/(tabs)');
              }}
              style={[ServiceStyles.directionButton, {backgroundColor: Colors.primary}]}
            >
              <Text style={Styles.actionText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null }
    </>
  )
}

export default Schedule;