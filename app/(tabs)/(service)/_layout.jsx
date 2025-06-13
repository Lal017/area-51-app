import { Stack } from 'expo-router';
import { CustHeader } from '../../../components/components';

const scheduleLayout = () =>
{
    return(
        <Stack
            screenOptions={{
                headerShown: true,
                animation: 'fade_from_bottom'
            }}
        >
            <Stack.Screen name='index' options={{title: 'Service', header: () => <CustHeader title='Service' index={true}/>}} />
            <Stack.Screen name='schedule' options={{title: 'Schedule', header: () => <CustHeader title='Appointment'/>}}/>
            <Stack.Screen name='towRequest' options={{title: 'Tow Request', header: () => <CustHeader title='Tow Request'/>}}/>
            <Stack.Screen name='towStatus' options={{title: 'Tow Status', header: () => <CustHeader title='Tow Status'/>}}/>
            <Stack.Screen name='myAppointments' options={{title: 'My Appointments', header: () => <CustHeader title='My Appointments'/>}}/>
            <Stack.Screen name='editAppointment' options={{title: 'Edit Appointment', header: () => <CustHeader title='Edit Appointment'/>}}/>
        </Stack>
    )
};

export default scheduleLayout;