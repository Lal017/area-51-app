import { Stack } from "expo-router";

const AuthLayout = () =>
{
    console.log('auth layout');
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="signUp" />
            <Stack.Screen name="signIn" />
            <Stack.Screen name="signUpConfirm" />
        </Stack>
    );
}

export default AuthLayout;