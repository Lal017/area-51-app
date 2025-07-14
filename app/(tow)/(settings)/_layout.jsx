import { Stack } from "expo-router";
import { CustHeader } from "../../../components/components";

const SettingsLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name="index" options={{title: "Settings", header: () => <CustHeader title='Settings'/>}} />
        </Stack>
    );
};

export default SettingsLayout;