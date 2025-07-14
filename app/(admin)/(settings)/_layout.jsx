import { Stack } from "expo-router";
import { CustHeader } from "../../../components/components";

const SettingsLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name='index' options={{title: 'Settings', header: () => <CustHeader title='Settings'/>}}/>
            <Stack.Screen name="accountEdit"  options={{title: "Edit Account", header: () => <CustHeader title="Account Edit" />}}/>
            <Stack.Screen name="resetPassword" options={{title: "Reset Password", header: () => <CustHeader title="Reset Password" />}}/>
            <Stack.Screen name="confirmAttribute" options={{title: "Confirm Change", header: () => <CustHeader title="Reset Password" />}}/>
            <Stack.Screen name="deleteAccount" options={{title: "Account Deletion", header: () => <CustHeader title="Account Deletion" />}}/>
        </Stack>
    );
};

export default SettingsLayout