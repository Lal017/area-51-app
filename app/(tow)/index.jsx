import Colors from "../../constants/colors";
import LottieView from "lottie-react-native";
import { Background } from "../../components/components";
import { Styles, AdminStyles, HomeStyles } from "../../constants/styles";
import { router } from 'expo-router';
import { Text, TouchableOpacity, Alert, Linking, View } from 'react-native';
import { requestBackgroundPermissionsAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { useApp } from "../../components/context";

const Index = () =>
{
    const { firstName, lastName, email } = useApp();

    return(
        <Background style={{rowGap: 5}}>
            <View style={Styles.block}>
                <View style={Styles.infoContainer}>
                    <Text style={Styles.headerTitle}>{firstName} {lastName}</Text>
                    <Text style={Styles.tabHeader}>{email}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: Colors.secondary}]}
                onPress={async () => {
                    const { status } = await requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert(
                            'NOTICE',
                            'You must give location permissions to accept a tow request',
                            [
                                {
                                    text: 'Settings',
                                    onPress: () => Linking.openSettings()
                                }
                            ]
                        );
                        return;
                    } else {
                        const { status } = await requestBackgroundPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert(
                                'NOTICE',
                                'You must give background location permissions to accept a tow request',
                                [
                                    {
                                        text: 'Settings',
                                        onPress: () => Linking.openSettings()
                                    }
                                ]
                            );
                            return;
                        }
                    }
                    router.push('(requests)');
                }}
            >
                <Text style={Styles.title}>View Requests</Text>
                <LottieView
                    source={require('../../assets/animations/astronaut.json')}
                    loop
                    autoPlay
                    style={AdminStyles.lottieAnim}
                    speed={0.5}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[Styles.consoleBubble, {backgroundColor: 'gray'}]}
                onPress={() => router.push('/(tow)/(settings)')}
            >
                <Text style={Styles.title}>Settings</Text>
                <LottieView
                    source={require('../../assets/animations/gear.json')}
                    loop
                    autoPlay
                    style={AdminStyles.lottieAnim}
                    speed={0.5}
                />
            </TouchableOpacity>
        </Background>
    );
};

export default Index;