import { useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { ServiceStyles, Styles } from "../../../constants/styles";
import { Calendar } from "react-native-calendars";
import { handleGetAppointments, handleSetDay, handleCreateAppointment } from '../../../components/scheduleComponents';
import Colors from '../../../constants/colors';
import { Picker } from '@react-native-picker/picker';
import { Select, CalendarHeader } from '../../../components/components';
import { MaterialIcons, Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
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
    handlePresentModalPress();
  };

  return (
    <ScrollView contentContainerStyle={Styles.scrollPage}>
      { step === 1 ? (
        <View style={ServiceStyles.calendarContainer}>
          <View style={ServiceStyles.informationContainer}>
            <Text style={Styles.subTitle}>Date Selection</Text>
            <Text style={Styles.text}>Select a date and time to get started</Text>
          </View>
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
          <TouchableOpacity
            style={ServiceStyles.continueButton}
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
      ) : step === 2 ? (
        <View style={ServiceStyles.vehicleContainer}>
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
          <Text style={Styles.subTitle}>Select a service</Text>
          <View style={ServiceStyles.picker}>
            <Picker
              selectedValue={selectedService}
              onValueChange={service => setSelectedService(service)}
            >
              <Picker.Item label='Select a service' value={0} enabled={false} color='gray'/>
              <Picker.Item label='Oil Change' value={'Oil Change'} />
              <Picker.Item label='Tuning' value={'Tuning'} />
              <Picker.Item label='Diagnosis' value={'Diagnosis'} />
              <Picker.Item label='Other' value={'Other'} />
            </Picker>
          </View>
          <TouchableOpacity
            style={ServiceStyles.continueButton}
            onPress={() => {
              if (selectedService && selectedVehicle) {
                setStep(3);
              }
            }}
          >
            <Text style={Styles.actionText}>Continue</Text>
            <FontAwesome name='arrow-right' size={24} color='white' />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[ServiceStyles.descriptionContainer, {marginTop: '40%'}]}>
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
          <TouchableOpacity
            onPress={() => {
              handleSendAdminNotif('Appointment Scheduled', 'A customer has scheduled an appointment');
              handleCreateAppointment(client, selectedDay, selectedTime.value, selectedService, notes, userId, selectedVehicle.id)
            }}
            style={Styles.actionButton}
          >
            <Text style={Styles.actionText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

export default Schedule;