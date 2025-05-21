import { useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from "react-native";
import { router } from 'expo-router';
import { ServiceStyles, Styles } from "../../../constants/styles";
import { Calendar } from "react-native-calendars";
import { handleGetAppointments, handleSetDay, handleCreateAppointment } from '../../../components/scheduleComponents';
import Colors from '../../../constants/colors';
import { Select, CalendarHeader } from '../../../components/components';
import { MaterialIcons, Ionicons, FontAwesome, AntDesign, FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../../components/context';
import { handleSendAdminNotif } from '../../../components/notifComponents';

const Schedule = () =>
{
  const { client, vehicles, userId } = useApp();

  const [selectedDay, setSelectedDay] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [selectedService, setSelectedService] = useState();
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [scheduledAppointments, setScheduledAppointments] = useState();
  const [availableAppointments, setAvailableAppointments] = useState();
  const [notes, setNotes] = useState();
  const [step, setStep] = useState(1);

  useEffect(() => {
    const initializeAppointments = async () =>
    {
      const scheduled = await handleGetAppointments();
      setScheduledAppointments(scheduled);
    };

    initializeAppointments();
  }, []);

  const handleDayPress = async (day) =>
  {
    setSelectedDay(day.dateString);
    const getDay = await handleSetDay(scheduledAppointments, day.dateString);
    setAvailableAppointments(getDay);
  };

  const formatDate = (dateString) =>
  {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
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
              renderArrow={direction => <AntDesign name={direction === 'left' ? 'arrowleft' : 'arrowright'} size={24}/>}
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
                    Styles.subTitle, selectedTime === time && { color: 'white' }, {textAlign: 'center'}
                  ]}
                  >{time.time}</Text>
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
        <View style={Styles.page}>
          <View style={ServiceStyles.selectionContainer}>
            <Text style={Styles.subTitle}>Select a Vehicle</Text>
            <View style={[Styles.tabContainer, {rowGap: 5}]}>
              {vehicles?.map((vehicle, index) => (
                <TouchableOpacity
                  key={index}
                  style={Styles.tabWrapper}
                >
                    <Ionicons
                      name="car-sport"
                      size={30}
                      style={Styles.icon}
                      color={selectedVehicle === vehicle ? Colors.backDrop : null}
                    />
                    <Select
                      text={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      selected={vehicle === selectedVehicle ? true : false}
                      action={() => setSelectedVehicle(vehicle)}
                    />
                    <FontAwesome
                      name={selectedVehicle === vehicle ? "circle" : "circle-o"}
                      size={25}
                      style={Styles.rightIcon}
                      color={selectedVehicle === vehicle ? Colors.backDrop : null}  
                    />
                </TouchableOpacity>
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
        </View>
      ) : step === 3 ? (
        <View style={Styles.page}>
          <View style={ServiceStyles.selectionContainer}>
            <Text style={Styles.subTitle}>Select a service</Text>
            <View style={[Styles.tabContainer, {rowGap: 5}]}>
              <TouchableOpacity style={Styles.tabWrapper}>
                <FontAwesome5
                  name="oil-can"
                  size={30}
                  style={Styles.icon}
                  color={selectedService === 'Oil Change' ? Colors.backDrop : null}
                />
                <Select
                  text="Oil Change"
                  selected={selectedService === 'Oil Change' ? true : false}
                  action={() => setSelectedService('Oil Change')}
                />
                <FontAwesome
                  name={selectedService === 'Oil Change' ? "circle" : "circle-o"}
                  size={25}
                  style={Styles.rightIcon}
                  color={selectedService === 'Oil Change' ? Colors.backDrop : null}  
                />
              </TouchableOpacity>
              <TouchableOpacity style={Styles.tabWrapper}>
                <FontAwesome
                  name="stethoscope"
                  size={30}
                  style={Styles.icon}
                  color={selectedService === 'Diagnosis' ? Colors.backDrop : null}
                />
                <Select
                  text="Diagnosis"
                  selected={selectedService === 'Diagnosis' ? true : false}
                  action={() => setSelectedService('Diagnosis')}
                />
                <FontAwesome
                  name={selectedService === 'Diagnosis' ? "circle" : "circle-o"}
                  size={25}
                  style={Styles.rightIcon}
                  color={selectedService === 'Diagnosis' ? Colors.backDrop : null}  
                />
              </TouchableOpacity>
              <TouchableOpacity style={Styles.tabWrapper}>
                <Entypo
                  name="area-graph"
                  size={30}
                  style={Styles.icon}
                  color={selectedService === 'Tuning' ? Colors.backDrop : null}
                />
                <Select
                  text="Tuning"
                  selected={selectedService === 'Tuning' ? true : false}
                  action={() => setSelectedService('Tuning')}
                />
                <FontAwesome
                  name={selectedService === 'Tuning' ? "circle" : "circle-o"}
                  size={25}
                  style={Styles.rightIcon}
                  color={selectedService === 'Tuning' ? Colors.backDrop : null}  
                />
              </TouchableOpacity>
              <TouchableOpacity style={Styles.tabWrapper}>
                <MaterialIcons
                  name="air"
                  size={30}
                  style={Styles.icon}
                  color={selectedService === 'A/C' ? Colors.backDrop : null}
                />
                <Select
                  text="A/C"
                  selected={selectedService === 'A/C' ? true : false}
                  action={() => setSelectedService('A/C')}
                />
                <FontAwesome
                  name={selectedService === 'A/C' ? "circle" : "circle-o"}
                  size={25}
                  style={Styles.rightIcon}
                  color={selectedService === 'A/C' ? Colors.backDrop : null}  
                />
              </TouchableOpacity>
              <TouchableOpacity style={Styles.tabWrapper}>
                <MaterialCommunityIcons
                  name="dots-horizontal-circle"
                  size={30}
                  style={Styles.icon}
                  color={selectedService === 'Other' ? Colors.backDrop : null}
                />
                <Select
                  text="Other"
                  selected={selectedService === 'Other' ? true : false}
                  action={() => setSelectedService('Other')}
                />
                <FontAwesome
                  name={selectedService === 'Other' ? "circle" : "circle-o"}
                  size={25}
                  style={Styles.rightIcon}
                  color={selectedService === 'Other' ? Colors.backDrop : null}  
                />
              </TouchableOpacity>
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
        </View>
      ) : step === 4 ? (
        <KeyboardAvoidingView behavior='padding' style={Styles.page}>
          <View style={ServiceStyles.descriptionContainer}>
            <View style={Styles.inputContainer}>
              <Text style={[Styles.subTitle, {textAlign: 'center', paddingLeft: 30, paddingRight: 30}]}>Please provide any notes about the vehicle worth mentioning.</Text>
              <View style={Styles.inputWrapper}>
                <MaterialIcons name='notes' size={30} style={Styles.iconAlt} />
                <TextInput
                  placeholder='description'
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
          </View>
        </KeyboardAvoidingView>
      ) : step === 5 ? (
        <View style={Styles.page}>
          <View style={ServiceStyles.informationContainer}>
            <Text style={Styles.subTitle}>Date</Text>
            <Text style={Styles.text}>{formatDate(selectedDay)}</Text>
            <Text style={Styles.subTitle}>Time</Text>
            <Text style={Styles.text}>{selectedTime.time}</Text>
            <Text style={Styles.subTitle}>Vehicle</Text>
            <Text style={Styles.text}>{`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}</Text>
            <Text style={Styles.subTitle}>Service</Text>
            <Text style={Styles.text}>{selectedService}</Text>
            <Text style={Styles.subTitle}>Notes</Text>
            <Text style={Styles.text}>{notes}</Text>
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
                  handleSendAdminNotif('Appointment Scheduled', 'A customer has scheduled an appointment');
                  handleCreateAppointment(client, selectedDay, selectedTime.value, selectedService, notes, userId, selectedVehicle.id);
                  router.replace('/(tabs)');
                }}
                style={[ServiceStyles.directionButton, {backgroundColor: Colors.primary}]}
              >
                <Text style={Styles.actionText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null }
    </>
  )
}

export default Schedule;