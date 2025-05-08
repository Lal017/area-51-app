import { Stack } from 'expo-router';

const homeLayout = () =>
{
    return(
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name='index' />
            <Stack.Screen name='towRequest' />
        </Stack>
    )
};

export default homeLayout;