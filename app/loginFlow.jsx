import { Stack } from "expo-router";

const LoginLayout = () =>
{
    return(
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="signIn" />
        </Stack>
    );
};

export default LoginLayout;