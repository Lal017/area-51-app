import { Stack } from "expo-router";
import { CustHeader } from "../../../components/components";

const AppointmentsLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name="index" options={{title: 'Appointments Console', header: () => <CustHeader title='Appointments'/>}}/>
            <Stack.Screen name="appointmentList" options={{title: 'Appointment List', header: () => <CustHeader title='Appointments'/>}}/>
            <Stack.Screen name="appointmentView" options={{title: 'Appointment', header: () => <CustHeader title='Appointment'/>}}/>
        </Stack>
    );
};

export default AppointmentsLayout;