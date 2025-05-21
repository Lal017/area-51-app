import { Stack } from 'expo-router';

const scheduleLayout = () =>
{
    return(
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name='index' />
            <Stack.Screen name='schedule' />
            <Stack.Screen name='towRequest' />
            <Stack.Screen name='myAppointments' />
        </Stack>
    )
};

export default scheduleLayout;