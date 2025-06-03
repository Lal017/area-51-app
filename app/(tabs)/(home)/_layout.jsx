import { Stack } from 'expo-router';
import { CustHeader } from '../../../components/components';

const homeLayout = () =>
{
    return(
        <Stack screenOptions={{headerShown: true}}>
            <Stack.Screen name='index' options={{title: 'Home', header: () => <CustHeader title='Home' index={true}/>}}/>
        </Stack>
    )
};

export default homeLayout;