import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { ScheduleStyles, Styles } from "../../../constants/styles";
import { Calendar } from "react-native-calendars";
import { handleGetAppointments, handleSetDay, handleCreateAppointment } from '../../../components/scheduleComponents';
import Colors from '../../../constants/colors';
import { Picker } from '@react-native-picker/picker';
import { Select } from '../../../components/components';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useApp } from '../../../components/context';

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
  }

  return (
    <ScrollView contentContainerStyle={[Styles.scrollPage, {paddingBottom: 35}]}>
      <View style={ScheduleStyles.container}>
        <View style={ScheduleStyles.calendarContainer}>
          <Calendar
            theme={{
              todayTextColor: 'black'
            }}
            minDate={new Date().toDateString()}
            onDayPress={day => handleDayPress(day)}
            enableSwipeMonths={true}
            markedDates={{
              [selectedDay]: {
                selected: true,
                selectedColor: Colors.primary,
              }
            }}
          />
        </View>
        <ScrollView
          contentContainerStyle={ScheduleStyles.timeContainer}
          horizontal={true}
        >
          {availableAppointments?.map((time, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedTime(time)}
              style={[
                ScheduleStyles.timeBox,
                selectedTime === time && {
                  backgroundColor: Colors.secondary
                }
              ]}
            >
              <Text style={[
                selectedTime === time && {
                  color: 'white'
                }
              ]}
              >{time.time}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={Styles.hr} />
      <View style={ScheduleStyles.infoContainer}>
        <Text style={Styles.subTitle}>Select a Vehicle</Text>
        <View style={Styles.tabContainer}>
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
        <View style={Styles.hr}/>
        <Text style={Styles.subTitle}>Select a service</Text>
        <View style={ScheduleStyles.picker}>
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
        <View style={Styles.inputContainer}>
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
          onPress={() => handleCreateAppointment(client, selectedDay, selectedTime.value, selectedService, notes, userId, selectedVehicle.id)}
          style={Styles.actionButton}
        >
          <Text style={Styles.actionText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Schedule;