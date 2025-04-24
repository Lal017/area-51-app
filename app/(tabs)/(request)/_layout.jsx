import { Stack } from 'expo-router';

const requestLayout = () =>
{
    return(
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name='index' />
        </Stack>
    )
};

export default requestLayout;