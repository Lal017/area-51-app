import { Stack } from 'expo-router';
import { CustHeader } from '../../../components/components';

const homeLayout = () =>
{
    return(
        <Stack screenOptions={{headerShown: true}}>
            <Stack.Screen name='index' options={{title: 'Home', header: () => <CustHeader title='Home'/>}}/>
        </Stack>
    )
};

export default homeLayout;