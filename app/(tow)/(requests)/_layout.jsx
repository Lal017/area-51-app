import { Stack } from "expo-router";
import { CustHeader } from "../../../components/components";

const RequestsLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name="index" options={{title: 'Request list', header: () => <CustHeader title='Request List'/>}}/>
            <Stack.Screen name="towResponse" options={{title: 'Tow Request', header: () => <CustHeader title='Tow Request'/>}}/>
            <Stack.Screen name="towProgress" options={{title: 'Tow Progress', header: () => <CustHeader title='Tow Progress'/>}}/>
        </Stack>
    );
};

export default RequestsLayout;