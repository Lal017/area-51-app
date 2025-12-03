import { Stack } from 'expo-router';
import { CustHeader } from '../../../components/components';
import { useApp } from '../../../components/context';

const homeLayout = () =>
{
    const { towRequest } = useApp();
    return(
        <Stack
            screenOptions={{
                headerShown: true,
                animation: 'fade_from_bottom',
            }}
        >
            <Stack.Screen name='index' options={{title: 'Home', header: () => <CustHeader title='Home' index={true}/>}}/>
            <Stack.Screen name="vehicleList" options={{title: "My Vehicles", header: () => <CustHeader title="Vehicles" />}}/>
            <Stack.Screen name="vehicleAdd" options={{title: "New Vehicle", header: () => <CustHeader title="New Vehicle" />}}/>
            <Stack.Screen name="vehicleEdit" options={{title: "Edit Vehicle", header: () => <CustHeader title="Edit Vehicle" />}}/>
            <Stack.Screen name="vehiclePickup" options={{title: "Pickup Vehicle", header: () => <CustHeader title="Vehicle Pickup" />}}/>
            <Stack.Screen name='schedule' options={{title: 'Schedule', header: () => <CustHeader title='Appointment'/>}}/>
            <Stack.Screen name='towRequest' options={{title: 'Tow Request', header: () => <CustHeader title='Tow Request'/>}}/>
            <Stack.Screen name='towStatus' options={{title: 'Tow Status', header: () => towRequest?.status === 'IN_PROGRESS' ? null : <CustHeader title='Tow Status'/>}}/>
        </Stack>
    )
};

export default homeLayout;