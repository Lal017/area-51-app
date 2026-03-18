import Colors from '../../../constants/colors';
import moment from 'moment';
import { handleGetAllAppointments } from '../../../components/appointmentComponents';
import { BackgroundAlt, CalendarHeader, Loading, Tab } from '../../../components/components';
import { Styles } from '../../../constants/styles';
import { View } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { AgendaList, CalendarProvider, Calendar } from 'react-native-calendars';
import { useState, useEffect, useMemo } from 'react';
import { router } from 'expo-router';
import { useApp } from '../../../components/context';
import { textSize, formatTime } from '../../../constants/utils';

const AppointmentIndex = () =>
{
    const { client } = useApp();
    const [ appointments, setAppointments ] = useState();
    const [ selected, setSelected ] = useState(new Date().toISOString().split('T')[0]);
    const [ ready, setReady ] = useState(false);

    // filter and order by time
    const filteredItems = useMemo(() => {
        return (appointments ?? [])
            .filter((item) => item.date === selected)
            .sort((a, b) => a.time.localeCompare(b.time)); // 'HH:mm:ss' strings sort correctly
    }, [appointments, selected]);

    const markedDots = useMemo(() => {
        const marks = {};

        appointments?.forEach((appointment, index) => {
            const date = appointment.date;
            if (!marks[date]) {
                marks[date] = { dots: []};
            }

            // Add a uniquely-keyed dot for each appointment
            marks[date].dots.push({
                key: `dot-${index}`, // unique key per dot
                color: Colors.tertiary
            });
        });

        return marks;
    }, [appointments, selected]);

    useEffect(() => {
        const handleGetAppointments = async () =>
        {
            try {
                const getAppointments = await handleGetAllAppointments(client);
                setAppointments(getAppointments);
                setReady(true);
            } catch (error) {
                console.error('ERROR, could not get appointments:', error);
                throw error;
            }
        }

        handleGetAppointments();
    }, []);

    const DISABLED_DAYS = ['Saturday', 'Sunday'];
    // used to disable certain days of the month
    const getDaysInMonth = (month, year, days) => {
        const start = moment().month(month).year(year).startOf('month');
        const end = moment().month(month).year(year).endOf('month');
        const dates = {}
        const disabled = { disabled: true, disableTouchEvents: true };

        let day = start.clone();
        while(day.isSameOrBefore(end)) {
            if (days.includes(day.format('dddd'))) {
                dates[day.format('YYYY-MM-DD')] = disabled;
            }
            day.add(1, 'day');
        }

        return dates;
    };

    const today = moment();
    const [markedDates, setMarkedDates] = useState(
        getDaysInMonth(today.month(), today.year(), DISABLED_DAYS)
    );

    const handleMonthChange = (date) => setMarkedDates(getDaysInMonth(date.month - 1, date.year, DISABLED_DAYS));

    return (
        <>
        { ready ? (
            <BackgroundAlt>
                <View style={{flex: 1}}>
                    <CalendarProvider
                        date={selected ?? new Date().toISOString().split('T')[0]}
                    >
                        <Calendar
                            minDate={new Date().toDateString()}
                            onMonthChange={handleMonthChange}
                            theme={{
                                calendarBackground: 'transparent',
                                todayTextColor: Colors.secondary,
                                textDayFontSize: textSize(15),
                                dayTextColor: Colors.secondary,
                                textDisabledColor: Colors.backgroundAccent
                            }}
                            onDayPress={(day) => {
                                setSelected(day.dateString);
                            }}
                            markingType='multi-dot'
                            markedDates={{
                                ...markedDates,
                                ...markedDots,
                                [selected]: {
                                    selected: true,
                                    selectedColor: Colors.tertiary,
                                }
                            }}
                            renderHeader={date => <CalendarHeader date={date}/>}
                            renderArrow={direction => <Entypo name={direction === 'left' ? 'chevron-with-circle-left' : 'chevron-with-circle-right'} size={24} color={Colors.backDropAccent}/>}
                        />
                        <AgendaList
                            theme={{
                                calendarBackground: 'transparent'
                            }}
                            sections={[
                                {
                                    title: selected,
                                    data: filteredItems
                                }
                            ]}
                            renderItem={({ item }) => (
                                <Tab
                                    header={`${item?.user?.firstName} ${item?.user?.lastName}`}
                                    text={`${formatTime(item?.time)} | ${item?.service}`}
                                    action={() => {
                                        router.push({
                                            params: { appointmentParam: JSON.stringify(item)},
                                            pathname: '/appointmentView'
                                        })
                                    }}
                                    leftIcon={<AntDesign name='calendar' size={30} style={Styles.icon} />}
                                    rightIcon={<AntDesign name='right' size={25} style={Styles.rightIcon} />}
                                />
                            )}
                        />
                    </CalendarProvider>
                </View>
            </BackgroundAlt>
        ) : (
            <Loading/>
        )}
        </>
    );
};

export default AppointmentIndex;