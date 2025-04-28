import { Stack } from 'expo-router';

const scheduleLayout = () =>
{
    return(
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name='index' />
        </Stack>
    )
};

export default scheduleLayout;