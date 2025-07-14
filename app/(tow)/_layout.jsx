import { Stack } from "expo-router";
import { CustHeader } from "../../components/components";
import { AppProvider } from "../../components/context";

const TowDriverContent = () =>
{
    return(
        <Stack>
            <Stack.Screen name="index" options={{title: 'Console', header: () => <CustHeader title='Console'/>}}/>
        </Stack>
    );
};

const TowDriverLayout = () =>
{
    return(
        <AppProvider>
            <TowDriverContent/>
        </AppProvider>
    )
}
export default TowDriverLayout;