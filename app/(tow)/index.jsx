import Colors from "../../constants/colors";
import LottieView from "lottie-react-native";
import { Background } from "../../components/components";
import { Styles, AdminStyles } from "../../constants/styles";
import { router } from 'expo-router';
import { Text, TouchableOpacity, Alert, Linking } from 'react-native';
import { requestBackgroundPermissionsAsync, requestForegroundPermissionsAsync } from 'expo-location';

const Index = () =>
{
    return(
        <Background style={{justifyContent: 'center', rowGap: 2}}>
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