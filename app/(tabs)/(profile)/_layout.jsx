import { Stack } from "expo-router";

const ProfileLayout = () =>
{
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" />
            <Stack.Screen name="settings" />
        </Stack>
    );
}

export default ProfileLayout;