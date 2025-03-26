import { Stack } from "expo-router";

const AuthLayout = () =>
{
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="signUp" />
            <Stack.Screen name="signIn" />
            <Stack.Screen name="signUpConfirm" />
        </Stack>
    );
}

export default AuthLayout;