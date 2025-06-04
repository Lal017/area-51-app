import { Stack } from "expo-router";

const AuthLayout = () =>
{
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade_from_bottom'
            }}
        >
            <Stack.Screen name="signIn" />
            <Stack.Screen name="signUp" />
            <Stack.Screen name="signUpConfirm" />
            <Stack.Screen name="resetPassword" />
            <Stack.Screen name="resetPasswordConfirm" />
        </Stack>
    );
}

export default AuthLayout;