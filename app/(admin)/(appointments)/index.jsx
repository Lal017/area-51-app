import Colors from '../../../constants/colors';
import { handleGetAllAppointments } from '../../../components/appointmentComponents';
import { BackgroundAlt, Loading, Tab, formatTime } from '../../../components/components';
import { Styles } from '../../../constants/styles';
import { View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { AgendaList, CalendarProvider, Calendar } from 'react-native-calendars';
import { useState, useEffect, useMemo } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { router } from 'expo-router';
import { useApp } from '../../../components/context';

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

    const markedDates = useMemo(() => {
        const marks = {};

        appointments?.forEach((appointment, index) => {
            const date = appointment.date;
            if (!marks[date]) {
                marks[date] = { dots: []};
            }

            // Add a uniquely-keyed dot for each appointment
            marks[date].dots.push({
                key: `dot-${index}`, // unique key per dot
                color: Colors.secondary
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

    return (
        <>
        { ready ? (
            <BackgroundAlt>
                <View style={{flex: 1}}>
                    <CalendarProvider
                        date={selected ?? new Date().toISOString().split('T')[0]}
                    >
                        <Calendar
                            minDate={new Date().toISOString().split('T')[0]}
                            theme={{
                                calendarBackground: 'transparent',
                                todayTextColor: Colors.secondary,
                                textDayFontSize: RFValue(15),
                                dayTextColor: Colors.backDropAccent,
                                textDisabledColor: Colors.backgroundAccent
                            }}
                            onDayPress={(day) => {
                                setSelected(day.dateString);
                            }}
                            markingType='multi-dot'
                            markedDates={{
                                ...markedDates,
                                [selected]: {
                                    selected: true,
                                    selectedColor: Colors.tertiary,
                                }
                            }}
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
                                    text={`${item?.user?.firstName} ${item?.user?.lastName}${'\n'}${formatTime(item?.time)} | ${item?.service}`}
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