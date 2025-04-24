import { Stack } from "expo-router";

const ProfileLayout = () =>
{
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="accountEdit" />
            <Stack.Screen name="changePassword" />
            <Stack.Screen name="confirmAttribute" />
            <Stack.Screen name="contact" />
            <Stack.Screen name="deleteAccount" />
        </Stack>
    );
}

export default ProfileLayout;