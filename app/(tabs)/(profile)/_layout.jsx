import { Stack } from "expo-router";
import { CustHeader } from "../../../components/components";
import Colors from "../../../constants/colors";

const ProfileLayout = () =>
{
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                contentStyle: {
                    backgroundColor: Colors.background
                },
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name="index" options={{title: "Profile", header: () => <CustHeader title="Profile" index={true} />}}/>
            <Stack.Screen name="settings" options={{title: "Settings", header: () => <CustHeader title="Settings" />}}/>
            <Stack.Screen name="accountEdit" options={{title: "Account Edit", header: () => <CustHeader title="Account Edit" />}}/>
            <Stack.Screen name="resetPassword" options={{title: "Reset Password", header: () => <CustHeader title="Reset Password" />}}/>
            <Stack.Screen name="confirmAttribute" options={{title: "Confirm Change", header: () => <CustHeader title="Reset Password" />}}/>
            <Stack.Screen name="contact" options={{title: "Contact Us", header: () => <CustHeader title="Contact Us" />}}/>
            <Stack.Screen name="deleteAccount" options={{title: "Account Deletion", header: () => <CustHeader title="Account Deletion" />}}/>
            <Stack.Screen name="vehicleList" options={{title: "My Vehicles", header: () => <CustHeader title="Vehicles" />}}/>
            <Stack.Screen name="vehicleAdd" options={{title: "New Vehicle", header: () => <CustHeader title="New Vehicle" />}}/>
            <Stack.Screen name="vehicleEdit" options={{title: "Edit Vehicle", header: () => <CustHeader title="Edit Vehicle" />}}/>
        </Stack>
    );
}

export default ProfileLayout;