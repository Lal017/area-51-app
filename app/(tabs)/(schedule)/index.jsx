import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { ScheduleStyles } from "../../../constants/styles";
import { Calendar } from "react-native-calendars";
import Colors from '../../../constants/colors';

const TIME_SLOTS = [
{
  time: '09:00 AM',
  value: '09:00:00'
},
{
  time: '10:00 AM',
  value: '10:00:00'
},
{
  time: '11:00 AM',
  value: '11:00:00'
},
{
  time: '12:00 PM',
  value: '12:00:00'
},
{
  time: '01:00 PM',
  value: '13:00:00'
},
{
  time: '02:00 PM',
  value: '14:00:00'
},
{
  time: '03:00 PM',
  value: '15:00:00'
},
{
  time: '04:00 PM',
  value: '16:00:00'
}
];

const Schedule = () =>
{
  const [selected, setSelected] = useState();

  return (
    <ScrollView contentContainerStyle={ScheduleStyles.page}>
      <View style={ScheduleStyles.calendarContainer}>
        <Calendar
          theme={{
            todayTextColor: 'black'
          }}
          minDate={new Date().toDateString()}
          onDayPress={day => { setSelected(day.dateString); }}
          enableSwipeMonths={true}
          markedDates={{
            [selected]: {
              selected: true,
              selectedColor: Colors.primary,
            }
          }}
        />
      </View>
      <View style={ScheduleStyles.timeContainer}>
        {TIME_SLOTS.map((time, index) => (
          <TouchableOpacity
            key={index}
            style={ScheduleStyles.timeBox}
          >
            <Text style={{textAlign: 'center'}}>{time.time}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

export default Schedule;