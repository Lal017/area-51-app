import { Stack } from "expo-router";
import { CustHeader } from "../../../components/components";

const UsersLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name="index" options={{title: 'Users List', header: () => <CustHeader title='Users'/>}}/>
            <Stack.Screen name="userView" options={{title: 'User', header: () => <CustHeader title='User'/>}}/>
            <Stack.Screen name="invoiceList" options={{title: 'Invoice List', header: () => <CustHeader title='Invoice List'/>}}/>
            <Stack.Screen name="invoiceUpload" options={{title: 'Invoice Upload', header: () => <CustHeader title='Invoice Upload'/>}}/>
            <Stack.Screen name="estimateList" options={{title: 'Estimate List', header: () => <CustHeader title='Estimate List'/>}}/>
            <Stack.Screen name="estimateUpload" options={{title: 'Estimate Upload', header: () => <CustHeader title='Estimate Upload'/>}}/>
        </Stack>
    );
};

export default UsersLayout;